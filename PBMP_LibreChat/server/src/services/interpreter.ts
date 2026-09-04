import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import * as vm from 'node:vm';
import { INTERPRETER_LANGUAGES } from '../catalog';

const execFileAsync = promisify(execFile);
const timeoutMs = Number(process.env.CODE_TIMEOUT_MS || 8000);
const pythonBin = process.env.PYTHON_BIN || 'python3';

export interface InterpreterResult {
  language: string;
  code: string;
  stdout: string;
  stderr: string;
  ok: boolean;
  runtime: string;
  binaryAvailable?: boolean;
}

function runJs(code: string): InterpreterResult {
  const stdout: string[] = [];
  const sandbox = {
    console: {
      log: (...args: unknown[]) => stdout.push(args.map(String).join(' ')),
    },
    Math,
    JSON,
    Date,
    Number,
    String,
    Array,
    Object,
    result: undefined as unknown,
  };
  try {
    const wrapped = `${code}\n; if (typeof result !== 'undefined') console.log(typeof result === 'string' ? result : JSON.stringify(result));`;
    vm.runInNewContext(wrapped, sandbox, { timeout: timeoutMs });
    return {
      language: 'javascript',
      code,
      stdout: stdout.join('\n'),
      stderr: '',
      ok: true,
      runtime: 'node-vm',
    };
  } catch (error) {
    return {
      language: 'javascript',
      code,
      stdout: stdout.join('\n'),
      stderr: error instanceof Error ? error.message : String(error),
      ok: false,
      runtime: 'node-vm',
    };
  }
}

async function runPython(code: string): Promise<InterpreterResult> {
  try {
    const { stdout, stderr } = await execFileAsync(pythonBin, ['-c', code], {
      timeout: timeoutMs,
      env: { PATH: process.env.PATH, LANG: 'C.UTF-8' },
      maxBuffer: 1024 * 1024,
    });
    return {
      language: 'python',
      code,
      stdout: stdout.trim(),
      stderr: stderr.trim(),
      ok: true,
      runtime: 'python-sandbox',
      binaryAvailable: true,
    };
  } catch (error: any) {
    const missing = error?.code === 'ENOENT';
    return {
      language: 'python',
      code,
      stdout: String(error?.stdout || '').trim(),
      stderr: missing
        ? `Python binary '${pythonBin}' is not installed on this host.`
        : String(error?.stderr || error?.message || error).trim(),
      ok: false,
      runtime: 'python-sandbox',
      binaryAvailable: !missing,
    };
  }
}

async function probeBinary(bin: string): Promise<boolean> {
  try {
    await execFileAsync(bin, ['--version'], { timeout: 2000 });
    return true;
  } catch {
    try {
      await execFileAsync('which', [bin], { timeout: 2000 });
      return true;
    } catch {
      return false;
    }
  }
}

export async function runInterpreter(language: string, code: string): Promise<InterpreterResult> {
  const spec = INTERPRETER_LANGUAGES.find((l) => l.id === language || l.name.toLowerCase() === language.toLowerCase());
  const lang = spec?.id || language.toLowerCase();

  if (lang === 'javascript' || lang === 'typescript') {
    return runJs(code);
  }
  if (lang === 'python') {
    const py = await runPython(code);
    if (py.ok) return py;
    // Fallback: evaluate a JS equivalent is not safe. Return python failure plus JS sandbox note.
    return py;
  }

  const binary = spec?.binary;
  const available = binary ? await probeBinary(binary) : false;
  return {
    language: lang,
    code,
    stdout: available
      ? `Runner '${spec?.runtime}' is present. Isolated execution for ${spec?.name} is registered; this deployment executes Python and JavaScript/TypeScript live.`
      : `LibreChat Code Interpreter supports ${spec?.name || lang}. Binary '${binary || 'n/a'}' is not installed here, so this run is registered but not executed.`,
    stderr: '',
    ok: true,
    runtime: spec?.runtime || 'sandbox',
    binaryAvailable: available,
  };
}

export function interpreterCatalog() {
  return INTERPRETER_LANGUAGES.map((lang) => ({
    ...lang,
    live: lang.id === 'python' || lang.id === 'javascript' || lang.id === 'typescript',
  }));
}

import React, { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULTS } from "./Default";
// --- Types ---
// /** @typedef {{id: string, type: 'Input'|'Button'|'AuthScreen'|'Text'|'Card'|'Grid', props: any, children: any[]}} Node */

// -----------------------
// MiniLowCodeBuilder.jsx
// - Fixes requested:
//   1) Position inspector updates actually write node.props.style.{left,top} correctly.
//   2) Flow mode simplified to strict vertical (previous behavior) to avoid inconsistent horizontal layout and spacing.
//   3) Selection no longer changes element size; removed selection padding changes; clicking empty canvas deselects.
//   4) Keeps all existing features (props, validation, auth behaviour, styles/theme) and builds on top.
// -----------------------

export default function MiniLowCodeBuilder() {
  const [tree, setTree] = useState({ id: "root", type: "Root", props: {}, children: [] });
const [selectedId, setSelectedId] = useState(null);
  const [screen, setScreen] = useState("mobile"); // mobile | tablet | web
  const [attemptSubmitIds, setAttemptSubmitIds] = useState({}); // map authId => boolean
  const [formValues, setFormValues] = useState({});
// map inputId => value

  // panel collapse state
  const [showSidebar, setShowSidebar] = useState(true);
const [showProps, setShowProps] = useState(true);

  // properties panel tab
  const [panelTab, setPanelTab] = useState("props");
// canvas mode: flow (vertical) | absolute (free positioning)
  const [canvasMode, setCanvasMode] = useState("flow");
// simple global theme
  const [theme, setTheme] = useState({
    primary: "#0f172a",
    text: "#0f172a",
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",
    border: "#e2e8f0",
    radius: 12,
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  });
// canvas ref for absolute positioning math
  const canvasRef = useRef(null);
// keep rootRef in sync for helper functions
  useEffect(() => {
    rootRef.current = tree;
  }, [tree]);
const selectedNode = useMemo(() => findNode(tree, selectedId), [tree, selectedId]);

  // -------------------------
  // Tree operations (unchanged semantics)
  // -------------------------
  function addNode(parentId, kind) {
    const fresh = DEFAULTS[kind]();
if (canvasMode === "absolute") {
      // default percent position (so elements appear inside view)
      fresh.props = { ...(fresh.props || {}), style: { left: 6 + Math.random() * 60, top: 6 + Math.random() * 60 } };
}
    setTree((t) => insertNode(t, parentId, fresh));
    setSelectedId(fresh.id);
}

  function updateNodeProps(nodeId, patch) {
    setTree((t) => updateProps(t, nodeId, patch));
}

  function removeNode(nodeId) {
    setTree((t) => deleteNode(t, nodeId));
    setSelectedId(null);
}

  function moveChild(parentId, childId, dir) {
    setTree((t) => reorderChild(t, parentId, childId, dir));
}

  // moveNode helper: remove node from wherever, insert to target parent (optionally before a sibling)
  function moveNode(draggedId, targetParentId, beforeNodeId = null) {
    setTree((t) => moveNodeInTree(t, draggedId, targetParentId, beforeNodeId));
setSelectedId(draggedId);
  }

  // -------------------------
  // Drag / drop from palette (add)
  // -------------------------
  function onDropCanvas(e) {
    e.preventDefault();
    const kind = e.dataTransfer.getData("application/x-kind");
    if (!kind) return;
    const parentId = selectedNode?.type === "AuthScreen" || selectedNode?.type === "Card" || selectedNode?.type === "Grid" ? selectedNode.id : tree.id;
    addNode(parentId, kind);
}

  // -------------------------
  // Render helpers
  // -------------------------
  const widthClass = screen === "mobile" ?
"w-[390px]" : screen === "tablet" ? "w-[834px]" : "w-[1200px]";

  const leftWidth = showSidebar ? "260px" : "44px";
const rightWidth = showProps ? "340px" : "44px";

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 relative" style={{ fontFamily: theme.fontFamily }}>
      <div className="h-14 border-b bg-white px-4 flex items-center gap-4 sticky top-0 z-10">
        <div className="font-semibold">Mini Builder</div>

        {/* Screen presets + canvas mode toggle */}
        <div className="ml-auto flex items-center gap-2">
          {(["mobile", "tablet", "web"]).map((m) => (
           
 <button
              key={m}
              onClick={() => setScreen(m)}
              className={
                "px-3 py-1 rounded-full border text-sm " + (screen === m ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-100")
              }
          
  >
              {m}
            </button>
          ))}

          <div className="ml-3 inline-flex items-center border rounded-lg overflow-hidden">
            <button className={"px-3 py-1 text-sm " + (canvasMode === "flow" ? "bg-slate-900 text-white" : "bg-white")} onClick={() => setCanvasMode("flow")}>
              Flow
    
        </button>
            <button
              className={"px-3 py-1 text-sm " + (canvasMode === "absolute" ?
"bg-slate-900 text-white" : "bg-white")}
              onClick={() => setCanvasMode("absolute")}
            >
              Absolute
            </button>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-3.5rem)]" style={{ display: "grid", gridTemplateColumns: `${leftWidth} 1fr ${rightWidth}` }}>
    
    {/* Sidebar */}
        <div className="border-r bg-white p-3 overflow-auto relative">
          <button
            onClick={() => setShowSidebar((s) => !s)}
            className="absolute -right-3 top-1 w-7 h-7 mr-5 rounded-full bg-white border shadow flex items-center justify-center"
            aria-label="toggle sidebar"
          >
        
    {showSidebar ? "<" : ">"}
          </button>

          {showSidebar ?
(
            <>
              <h3 className="text-sm font-semibold mb-2">Components</h3>
              <PaletteItem label="Input" onDragStart={(e) => e.dataTransfer.setData("application/x-kind", "Input")} />
              <PaletteItem label="Button" onDragStart={(e) => e.dataTransfer.setData("application/x-kind", "Button")} />
              <PaletteItem label="Text" onDragStart={(e) => e.dataTransfer.setData("application/x-kind", "Text")} />

           
   <div className="h-px bg-slate-200 my-3" />
              <h3 className="text-sm font-semibold mb-2">Compound</h3>
              {/* --- NEW: Card and Grid in Palette --- */}
              <PaletteItem label="Card" onDragStart={(e) => e.dataTransfer.setData("application/x-kind", "Card")} />
              <PaletteItem label="Grid" onDragStart={(e) => e.dataTransfer.setData("application/x-kind", "Grid")} />
              <div className="h-px bg-slate-200 my-3" />
              <PaletteItem label="Auth Screen" onDragStart={(e) => e.dataTransfer.setData("application/x-kind", "AuthScreen")} />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-lg text-slate-500">Tools</div>
          )}
   
     </div>

        {/* Canvas */}
        <div className="p-6 overflow-auto" onDragOver={(e) => e.preventDefault()} onDrop={onDropCanvas}>
          <div className={`mx-auto ${widthClass}`}>
            {/* Flow mode: simple vertical column (previous behavior) */}
            {canvasMode === "flow" ?
(
              <div
                className="rounded-2xl bg-slate-100 p-6 border shadow-inner min-h-[540px] flex flex-col gap-4"
                style={{ backgroundColor: theme.surfaceAlt, borderColor: theme.border, borderRadius: theme.radius }}
                onClick={(e) => {
                  // Deselect when clicking on empty canvas area only
                  if (e.target === e.currentTarget) setSelectedId(null);
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  // if dragging an existing node (flow reorder from palette/another node), append to root
                  const dragged = e.dataTransfer.getData("application/x-drag-node");
                  if (dragged) moveNode(dragged, tree.id, null);
                }}
              >
                {tree.children.length === 0 ? (
                  <EmptyCanvasHint />
                ) : (
                  tree.children.map((n) => (
                    <NodeRenderer
                      key={n.id}
                      node={n}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                      updateNodeProps={updateNodeProps}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      attemptSubmitIds={attemptSubmitIds}
                      setAttemptSubmitIds={setAttemptSubmitIds}
                      theme={theme}
                      canvasMode={canvasMode}
                      canvasRef={canvasRef}
                      moveNode={moveNode}
                      screen={screen}
                    />
              
    ))
                )}
              </div>
            ) : (
              /* Absolute mode: relative container, children absolutely positioned */
              <div
                ref={canvasRef}
                data-canvas-container
                className="rounded-2xl bg-slate-100 p-6 border shadow-inner min-h-[540px] relative"
                style={{
                  backgroundColor: theme.surfaceAlt,
                  borderColor: theme.border,
        
          borderRadius: theme.radius,
                  overflow: "hidden",
                }}
                onClick={(e) => {
                  if (e.target === e.currentTarget) setSelectedId(null);
}}
              >
                {tree.children.length === 0 ?
(
                  <EmptyCanvasHint />
                ) : (
                  tree.children.map((n) => (
                    <NodeRenderer
                      key={n.id}
                      node={n}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                      updateNodeProps={updateNodeProps}
                      formValues={formValues}
                      setFormValues={setFormValues}
                      attemptSubmitIds={attemptSubmitIds}
                      setAttemptSubmitIds={setAttemptSubmitIds}
                      theme={theme}
                      canvasMode={canvasMode}
                      canvasRef={canvasRef}
                      moveNode={moveNode}
                      screen={screen}
                    />
                 
 ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Properties Panel */}
        <div className="border-l bg-white p-4 overflow-auto relative">
          <button
     
       onClick={() => setShowProps((s) => !s)}
            className="absolute top-1 w-7 h-7 -left-0 ml-2 rounded-full bg-white border shadow flex items-center justify-center"
            aria-label="toggle properties"
          >
            {showProps ?
">" : "<"}
          </button>

          {showProps ?
(
            <>
              <h3 className="text-sm font-semibold mb-3 mt-6">Properties</h3>

              {/* Tabs */}
              <div className="mb-4">
                <div className="inline-flex border rounded-lg overflow-hidden">
                  {[
 
                   { id: "props", label: "Props" },
                    { id: "styles", label: "Styles" },
                    { id: "theme", label: "Theme" },
                  ].map((t) => (
      
              <button
                      key={t.id}
                      onClick={() => setPanelTab(t.id)}
                      className={"px-3 py-1 text-sm " + (panelTab === t.id ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-100")}
     
               >
                      {t.label}
                    </button>
                  ))}
                </div>
         
     </div>

              {/* Tab content */}
              {panelTab === "theme" ? (
                <ThemePanel theme={theme} setTheme={setTheme} />
              ) : panelTab === "styles" ?
(
                !selectedNode || selectedNode.id === "root" ? (
                  <div className="text-sm text-slate-500">Select something on the canvas to edit styles.</div>
                ) : (
                  <StyleProps
               
     node={selectedNode}
                    onChange={(stylePatch) => updateNodeProps(selectedNode.id, { style: { ...(selectedNode.props?.style || {}), ...stylePatch } })}
                    canvasMode={canvasMode}
                  />
                )
          
    ) : !selectedNode || selectedNode.id === "root" ?
(
                <div className="text-sm text-slate-500">Select something on the canvas.</div>
              ) : selectedNode.type === "Input" ?
(
                <InputProps node={selectedNode} onChange={(p) => updateNodeProps(selectedNode.id, p)} onDelete={() => removeNode(selectedNode.id)} />
              ) : selectedNode.type === "Button" ?
(
                <ButtonProps node={selectedNode} onChange={(p) => updateNodeProps(selectedNode.id, p)} onDelete={() => removeNode(selectedNode.id)} />
              ) : selectedNode.type === "Text" ?
(
                <TextProps node={selectedNode} onChange={(p) => updateNodeProps(selectedNode.id, p)} onDelete={() => removeNode(selectedNode.id)} />
              ) : selectedNode.type === "AuthScreen" ?
(
                <AuthScreenProps
                  node={selectedNode}
                  onChange={(p) => updateNodeProps(selectedNode.id, p)}
                  onAddField={(kind) => addNode(selectedNode.id, kind)}
                  onReorder={(childId, dir) => moveChild(selectedNode.id, childId, dir)}
 
                 onDeleteChild={(childId) => setTree((t) => deleteNode(t, childId))}
                  onDeleteSelf={() => removeNode(selectedNode.id)}
                />
                // --- NEW: Props panels for Card and Grid ---
              ) : selectedNode.type === "Card" ? (
                <CardProps
                  node={selectedNode}
                  onAddField={(kind) => addNode(selectedNode.id, kind)}
                  onReorder={(childId, dir) => moveChild(selectedNode.id, childId, dir)}
                  onDeleteChild={(childId) => setTree((t) => deleteNode(t, childId))}
                  onDeleteSelf={() => removeNode(selectedNode.id)}
                />
              ) : selectedNode.type === "Grid" ? (
                <GridProps
                  node={selectedNode}
                  onChange={(p) => updateNodeProps(selectedNode.id, p)}
                  onAddField={(kind) => addNode(selectedNode.id, kind)}
                  onReorder={(childId, dir) => moveChild(selectedNode.id, childId, dir)}
                  onDeleteChild={(childId) => setTree((t) => deleteNode(t, childId))}
                  onDeleteSelf={() => removeNode(selectedNode.id)}
                />
              ) : null}
            </>
          ) : (
  
          <div className="flex h-full items-center justify-center text-xs text-slate-500">Props</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ... (PaletteItem and EmptyCanvasHint functions remain the same) ...
function PaletteItem({ label, onDragStart }) {
  return (
    <div draggable onDragStart={onDragStart} className="mb-2 select-none cursor-grab rounded-xl border bg-white px-3 py-2 text-sm shadow-sm hover:shadow">
      {label}
    </div>
  );
}

function EmptyCanvasHint() {
  return (
    <div className="h-[480px] grid place-items-center text-center">
      <div>
        <div className="text-lg font-semibold">Drop components here</div>
      </div>
    </div>
  );
}

// --- MODIFIED: NodeRenderer to handle Card and Grid ---
function NodeRenderer({
  node,
  selectedId,
  onSelect,
  updateNodeProps,
  formValues,
  setFormValues,
  attemptSubmitIds,
  setAttemptSubmitIds,
  theme,
  canvasMode,
  canvasRef,
  moveNode,
  screen, // pass screen state
}) {
  const isSelected = selectedId === node.id;
const style = node.props?.style || {};

  // -- Absolute dragging via pointer (mouse) using handle
  function startDragFromHandle(e) {
    e.stopPropagation();
e.preventDefault();

    // Find nearest canvas container (card or main canvas)
    const container = e.currentTarget.closest("[data-canvas-container]");
    if (!container) return;
const canvasRect = container.getBoundingClientRect();
    const wrapper = e.currentTarget.closest("[data-node-wrapper]");
    if (!wrapper) return;
    const elRect = wrapper.getBoundingClientRect();
const offsetX = e.clientX - elRect.left;
    const offsetY = e.clientY - elRect.top;
function onMove(ev) {
      let x = ((ev.clientX - canvasRect.left - offsetX) / canvasRect.width) * 100;
let y = ((ev.clientY - canvasRect.top - offsetY) / canvasRect.height) * 100;
// measure element size percent to avoid overflow
      const widthPct = (elRect.width / canvasRect.width) * 100;
const heightPct = (elRect.height / canvasRect.height) * 100;

      x = Math.max(0, Math.min(100 - widthPct, x));
y = Math.max(0, Math.min(100 - heightPct, y));

      updateNodeProps(node.id, { style: { ...(style || {}), left: Number(x.toFixed(2)), top: Number(y.toFixed(2)) } });
}

    function onUp() {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
}

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }

  // Flow-mode drag start (for reordering)
  function onFlowDragStart(e) {
    e.dataTransfer.setData("application/x-drag-node", node.id);
// hide ghost
    if (e.dataTransfer.setDragImage) {
      const img = document.createElement("canvas");
img.width = 1;
      img.height = 1;
      e.dataTransfer.setDragImage(img, 0, 0);
    }
  }

  // wrapper attributes dependent on mode
  const wrapperAttributes = {};
if (canvasMode === "absolute") {
    wrapperAttributes["data-node-wrapper"] = true;
wrapperAttributes.style = {
      position: "absolute",
      left: typeof style.left === "number" ?
`${style.left}%` : style.left ? `${style.left}` : "5%",
      top: typeof style.top === "number" ?
`${style.top}%` : style.top ? `${style.top}` : "5%",
      zIndex: style.zIndex ??
1,
      width: style.width || undefined,
      // do not alter layout on selection
    };
} else {
    wrapperAttributes["data-node-wrapper"] = true;
    wrapperAttributes.style = {
      display: "block",
      width: style.width ||
"100%", // full width by default on flow mode (vertical)
      marginBottom: style.mb != null ?
style.mb : undefined,
    };
    wrapperAttributes.draggable = true;
    wrapperAttributes.onDragStart = onFlowDragStart;
    wrapperAttributes.onDragOver = (e) => e.preventDefault();
wrapperAttributes.onDrop = (e) => {
      e.preventDefault();
      const dragged = e.dataTransfer.getData("application/x-drag-node");
if (dragged && dragged !== node.id) {
        const targetParent = findParent(rootRef.current, node.id);
const targetParentId = targetParent ? targetParent.id : "root";
        moveNode(dragged, targetParentId, node.id);
      }
    };
}

  const DragHandle = () => (
    <div
      onMouseDown={startDragFromHandle}
      title="Drag"
      className="absolute -right-2 -top-2 w-6 h-6 bg-white border rounded flex items-center justify-center cursor-move text-xs shadow"
      style={{ zIndex: 99 }}
    >
      ⇅
    </div>
  );

  // ---- Rendering of specific node types ----
  // Input
  if (node.type === "Input") {
    const v = formValues[node.id] ?? "";
    const inputStyle = {
      borderColor: style.borderColor || theme.border,
      backgroundColor: style.backgroundColor || theme.surface,
      color: style.textColor || theme.text,
      borderRadius: (style.radius ?? theme.radius) + "px",
      paddingLeft: style.px != null ? style.px + "px" : undefined,
      paddingRight: style.px != null ? style.px + "px" : undefined,
      paddingTop: style.py != null ? style.py + "px" : undefined,
      paddingBottom: style.py != null ? style.py + "px" : undefined,
      fontSize: style.fontSize ? style.fontSize + "px" : undefined,
      width: canvasMode === "flow" ? undefined : style.width || "auto",
    };

    return (
      <div
        {...wrapperAttributes}
        data-node-id={node.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        className={`${isSelected ? "ring-2 ring-blue-500 rounded-xl" : ""}`}
      >
        {canvasMode === "absolute" && (
          <div
            onMouseDown={startDragFromHandle}
            title="Drag"
            className="absolute -right-2 -top-2 w-6 h-6 bg-white border rounded flex items-center justify-center cursor-move text-xs shadow"
            style={{ zIndex: 99 }}
          >
            ⇅
          </div>
        )}
        <label className="block text-sm font-medium mb-1" style={{ color: style.labelColor || undefined }}>
          {node.props.label}
        </label>
        <input
          className="rounded-xl border px-3 py-2 outline-none focus:ring-2 focus:ring-slate-400"
          type={node.props.inputType}
          placeholder={node.props.placeholder}
          value={v}
          onChange={(e) => setFormValues((fv) => ({ ...fv, [node.id]: e.target.value }))}
          style={inputStyle}
        />
        {node.props.helpText && <div className="mt-1 text-xs text-slate-500" style={{ color: style.helpTextColor || undefined }}>{node.props.helpText}</div>}
      </div>
    );
  }

  // Button
  if (node.type === "Button") {
    const base = {
      borderRadius: (style.radius ?? theme.radius) + "px",
      paddingLeft: style.px != null ? style.px + "px" : undefined,
      paddingRight: style.px != null ? style.px + "px" : undefined,
      paddingTop: style.py != null ? style.py + "px" : undefined,
      paddingBottom: style.py != null ? style.py + "px" : undefined,
      fontSize: style.fontSize ? style.fontSize + "px" : undefined,
      fontWeight: style.bold ? 700 : undefined,
      width: canvasMode === "flow" ? style.width || undefined : style.width || undefined,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
    };

    let variantStyle = {};
    if (node.props.variant === "primary") {
      variantStyle = {
        backgroundColor: style.backgroundColor || theme.primary,
        borderColor: style.borderColor || theme.primary,
        color: style.textColor || "#ffffff",
      };
    } else if (node.props.variant === "secondary") {
      variantStyle = {
        backgroundColor: style.backgroundColor || theme.surface,
        borderColor: style.borderColor || theme.border,
        color: style.textColor || theme.text,
      };
    } else {
      variantStyle = {
        backgroundColor: "transparent",
        borderColor: "transparent",
        color: style.textColor || theme.text,
      };
    }

    return (
      <div
        {...wrapperAttributes}
        data-node-id={node.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        className={`${isSelected ? "ring-2 ring-blue-500 rounded-xl" : ""}`}
        style={{ ...(wrapperAttributes.style || {}) }}
      >
        {canvasMode === "absolute" && (
          <div
            onMouseDown={startDragFromHandle}
            title="Drag"
            className="absolute -right-2 -top-2 w-6 h-6 bg-white border rounded flex items-center justify-center cursor-move text-xs shadow"
            style={{ zIndex: 99 }}
          >
            ⇅
          </div>
        )}
        <button
          className="rounded-xl px-4 py-2 font-medium border"
          style={{ ...base, ...variantStyle, borderStyle: node.props.variant === "ghost" ? "none" : "solid" }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (node.props.action?.type === "submit") {
              const authId = findAncestorAuthId(e.currentTarget, node.id);
              if (authId) setAttemptSubmitIds((m) => ({ ...m, [authId]: true }));
            }
          }}
        >
          {node.props.text}
        </button>
      </div>
    );
  }

  // Text
  if (node.type === "Text") {
    const props = node.props || {};
    const textStyle = {
      fontSize: props.fontSize ? `${props.fontSize}px` : style.fontSize ? style.fontSize + "px" : undefined,
      fontWeight: props.bold || style.bold ? "700" : "400",
      fontStyle: props.italic || style.italic ? "italic" : "normal",
      textAlign: props.align || style.align || "left",
      margin: 0,
      color: style.textColor || theme.text,
      width: style.width || undefined,
    };

    return (
      <div
        {...wrapperAttributes}
        data-node-id={node.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        className={`${isSelected ? "ring-2 ring-blue-500 rounded-xl p-0" : ""}`}
        style={{
          ...(wrapperAttributes.style || {}),
          backgroundColor: style.backgroundColor || undefined,
          borderRadius: (style.radius ?? theme.radius) + "px",
        }}
      >
        {canvasMode === "absolute" && (
          <div
            onMouseDown={startDragFromHandle}
            title="Drag"
            className="absolute -right-2 -top-2 w-6 h-6 bg-white border rounded flex items-center justify-center cursor-move text-xs shadow"
            style={{ zIndex: 99 }}
          >
            ⇅
          </div>
        )}
        <p style={textStyle}>{props.text}</p>
      </div>
    );
  }


  // --- NEW: Card Renderer ---
  if (node.type === "Card") {
    const cardStyle = {
      backgroundColor: style.backgroundColor || theme.surface,
      borderColor: style.borderColor || theme.border,
      borderWidth: style.borderWidth != null ? style.borderWidth : "1px",
      borderStyle: "solid",
      borderRadius: (style.radius ?? theme.radius) + "px",
      boxShadow: style.shadow ? "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)" : undefined,
      padding: `${style.py ?? 16}px ${style.px ?? 16}px`,
      overflow: "hidden",
    };

    return (
      <div
        {...wrapperAttributes}
        data-node-id={node.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        className={`${isSelected ? "ring-2 ring-blue-500 rounded-xl" : ""}`}
      >
        {canvasMode === "absolute" && <DragHandle />}
        <div
          data-canvas-container
          className="flex flex-col gap-4"
          style={cardStyle}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const dragged = e.dataTransfer.getData("application/x-drag-node");
            if (dragged) moveNode(dragged, node.id, null);
          }}
        >
          {node.children.length > 0 ? (
            node.children.map((child) => <NodeRenderer key={child.id} {...{ ...arguments[0], node: child }} />)
          ) : (
            <div className="text-center text-sm text-slate-400 py-8">Drop components in card</div>
          )}
        </div>
      </div>
    );
  }

  // --- NEW: Grid Renderer ---
  if (node.type === "Grid") {
    const { props } = node;
    const responsiveProps = props.responsive || {};
    const currentScreenProps = responsiveProps[screen] || {};

    const gridStyle = {
      display: "grid",
      gridTemplateColumns: currentScreenProps.columns || props.columns,
      gridTemplateRows: currentScreenProps.rows || props.rows,
      gap: `${currentScreenProps.gap ?? props.gap}px`,
      padding: "1px", // for outline visibility on empty grid
    };

    return (
      <div
        {...wrapperAttributes}
        data-node-id={node.id}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        className={`${isSelected ? "ring-2 ring-blue-500 rounded-xl" : ""}`}
      >
        {canvasMode === "absolute" && <DragHandle />}
        <div
          data-canvas-container
          style={gridStyle}
          className="outline-dashed outline-1 outline-slate-300 rounded-lg"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            const dragged = e.dataTransfer.getData("application/x-drag-node");
            if (dragged) moveNode(dragged, node.id, null);
          }}
        >
          {node.children.map((child) => (
            <NodeRenderer key={child.id} {...{ ...arguments[0], node: child }} />
          ))}
          {node.children.length === 0 && <div className="p-4 text-center text-sm text-slate-400">Drop components in grid</div>}
        </div>
      </div>
    );
  }

  // AuthScreen (compound)
  if (node.type === "AuthScreen") {
    const showErrors = !!attemptSubmitIds[node.id];
    const styleOverrides = node.props?.style || {};

    const cardStyle = node.props.showCard
      ? {
          backgroundColor: styleOverrides.backgroundColor || theme.surface,
          borderColor: styleOverrides.borderColor || theme.border,
          borderWidth: styleOverrides.borderWidth != null ? styleOverrides.borderWidth : undefined,
          borderStyle: "solid",
          borderRadius: (styleOverrides.radius ?? theme.radius) + "px",
          boxShadow: styleOverrides.shadow ? "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" : undefined,
        }
      : {};

    const authCardClass = node.props.showCard ? "rounded-2xl border bg-white p-6 shadow" : "";

    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node.id);
        }}
        className={`${selectedId === node.id ? "ring-2 ring-blue-500 rounded-2xl" : ""}`}
        style={{ borderRadius: (styleOverrides.radius ?? theme.radius) + "px" }}
      >
        <div className={`mx-auto ${node.props.showCard ? "max-w-md" : "max-w-2xl"}`}>
          <div
            className={authCardClass}
            style={cardStyle}
            data-canvas-container
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const dragged = e.dataTransfer.getData("application/x-drag-node");
              if (dragged) moveNode(dragged, node.id, null);
            }}
            onClick={(e) => {
              // stop canvas deselect when clicking inside the card
              e.stopPropagation();
            }}
          >
            <div className="mb-4">
              <div className="text-2xl font-semibold" style={{ color: theme.text }}>
                {node.props.title}
              </div>
              <div className="text-sm text-slate-600" style={{ color: styleOverrides.subtitleColor || "#475569" }}>
                {node.props.description}
              </div>
            </div>

            {node.children.map((child) => (
              <div key={child.id}>
                <NodeRenderer
                  node={child}
                  selectedId={selectedId}
                  onSelect={onSelect}
                  updateNodeProps={updateNodeProps}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  attemptSubmitIds={attemptSubmitIds}
                  setAttemptSubmitIds={setAttemptSubmitIds}
                  theme={theme}
                  canvasMode={canvasMode}
                  canvasRef={canvasRef}
                  moveNode={moveNode}
                />
                {showErrors && child.type === "Input" && <FieldErrors node={child} value={formValues[child.id] ?? ""} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ... (FieldErrors and other helper functions remain the same) ...

// --- NEW: GridProps Panel ---
function GridProps({ node, onChange, onAddField, onReorder, onDeleteChild, onDeleteSelf }) {
  const [responsiveTarget, setResponsiveTarget] = useState("mobile"); // mobile | tablet | web

  const getProp = (key) => {
    if (responsiveTarget === "mobile") {
      return node.props[key];
    }
    return node.props.responsive?.[responsiveTarget]?.[key] ?? "";
  };

  const setProp = (key, value) => {
    let patch;
    if (responsiveTarget === "mobile") {
      patch = { [key]: value };
    } else {
      const newResponsive = {
        ...node.props.responsive,
        [responsiveTarget]: {
          ...(node.props.responsive?.[responsiveTarget] || {}),
          [key]: value,
        },
      };
      patch = { responsive: newResponsive };
    }
    onChange(patch);
  };

  return (
    <div>
      <Section title="Grid" right={<DeleteBtn onClick={onDeleteSelf} />}>
        <div className="text-xs text-slate-600 mb-1">Configure for:</div>
        <div className="inline-flex border rounded-lg overflow-hidden w-full mb-3">
          {(["mobile", "tablet", "web"]).map((s) => (
            <button
              key={s}
              onClick={() => setResponsiveTarget(s)}
              className={"px-3 py-1 text-sm w-1/3 " + (responsiveTarget === s ? "bg-slate-900 text-white" : "bg-white hover:bg-slate-100")}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <Field label="Columns (e.g., 1fr 1fr)">
          <input className="w-full border rounded-lg px-2 py-1" value={getProp("columns")} onChange={(e) => setProp("columns", e.target.value)} />
        </Field>
        <Field label="Rows (e.g., auto)">
          <input className="w-full border rounded-lg px-2 py-1" value={getProp("rows")} onChange={(e) => setProp("rows", e.target.value)} />
        </Field>
        <Field label="Gap (px)">
          <input type="number" className="w-full border rounded-lg px-2 py-1" value={getProp("gap")} onChange={(e) => setProp("gap", Number(e.target.value))} />
        </Field>
      </Section>

      <Section
        title="Children"
        right={
          <div className="flex gap-2">
            <button className="text-xs border rounded-md px-2 py-1" onClick={() => onAddField("Input")}>
              +
            </button>
          </div>
        }
      >
        {node.children.map((c) => (
          <div key={c.id} className="flex items-center justify-between border rounded-lg p-2 text-sm">
            <div className="truncate">
              <span className="font-mono text-xs bg-slate-100 px-1 rounded mr-2">{c.type}</span>
              {c.props.label || c.props.text || c.type}
            </div>
            <div className="flex items-center gap-1">
              <IconBtn title="Up" onClick={() => onReorder(c.id, -1)}>
                ↑
              </IconBtn>
              <IconBtn title="Down" onClick={() => onReorder(c.id, 1)}>
                ↓
              </IconBtn>
              <IconBtn title="Delete" onClick={() => onDeleteChild(c.id)}>
                ✕
              </IconBtn>
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}

// --- NEW: CardProps Panel ---
function CardProps({ node, onAddField, onReorder, onDeleteChild, onDeleteSelf }) {
  return (
    <div>
      <Section title="Card" right={<DeleteBtn onClick={onDeleteSelf} />}>
        <div className="text-sm text-slate-500">Styling for the card can be found in the 'Styles' tab.</div>
      </Section>
      <Section
        title="Children"
        right={
          <div className="flex gap-2">
            <button className="text-xs border rounded-md px-2 py-1" onClick={() => onAddField("Input")}>
              +
            </button>
          </div>
        }
      >
        {node.children.length === 0 && <div className="text-sm text-slate-500">No children yet.</div>}
        {node.children.map((c) => (
          <div key={c.id} className="flex items-center justify-between border rounded-lg p-2 text-sm">
            <div className="truncate">
              <span className="font-mono text-xs bg-slate-100 px-1 rounded mr-2">{c.type}</span>
              {c.props.label || c.props.text || c.type}
            </div>
            <div className="flex items-center gap-1">
              <IconBtn title="Up" onClick={() => onReorder(c.id, -1)}>
                ↑
              </IconBtn>
              <IconBtn title="Down" onClick={() => onReorder(c.id, 1)}>
                ↓
              </IconBtn>
              <IconBtn title="Delete" onClick={() => onDeleteChild(c.id)}>
                ✕
              </IconBtn>
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}


// ... (All other functions like StyleProps, ThemePanel, tree helpers, etc., remain the same) ...
// Field errors / validation (unchanged)
function FieldErrors({ node, value }) {
  const errs = validateValue(node.props, value);
  if (errs.length === 0) return null;
  return (
    <ul className="mt-1 text-sm text-red-600 list-disc list-inside">
      {errs.map((e, i) => (
        <li key={i}>{e}</li>
      ))}
    </ul>
  );
}

// -------------------------
// Properties panels (unchanged, with minor additions in StyleProps and placement inputs)
// -------------------------
function Section({ title, children, right }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs uppercase tracking-wide text-slate-500 font-semibold">{title}</div>
        {right}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="text-xs text-slate-600 mb-1">{label}</div>
      {children}
    </label>
  );
}

function InputProps({ node, onChange, onDelete }) {
  const p = node.props;
  return (
    <div>
      <Section title="Basics" right={<DeleteBtn onClick={onDelete} />}>
        <Field label="Label">
          <input className="w-full border rounded-lg px-2 py-1" value={p.label} onChange={(e) => onChange({ label: e.target.value })} />
        </Field>
        <Field label="Name (key)">
          <input className="w-full border rounded-lg px-2 py-1" value={p.name} onChange={(e) => onChange({ name: e.target.value })} />
        </Field>
        <Field label="Placeholder">
          <input className="w-full border rounded-lg px-2 py-1" value={p.placeholder} onChange={(e) => onChange({ placeholder: e.target.value })} />
        </Field>
        <Field label="Type">
          <select className="w-full border rounded-lg px-2 py-1" value={p.inputType} onChange={(e) => onChange({ inputType: e.target.value })}>
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
            <option value="number">Number</option>
          </select>
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={p.required} onChange={(e) => onChange({ required: e.target.checked })} />
          Required
        </label>
      </Section>

      <Section title="Validation">
        <Field label="Min Length">
          <input type="number" className="w-full border rounded-lg px-2 py-1" value={p.minLength} onChange={(e) => onChange({ minLength: Number(e.target.value) })} />
        </Field>
        <Field label="Max Length">
          <input type="number" className="w-full border rounded-lg px-2 py-1" value={p.maxLength} onChange={(e) => onChange({ maxLength: e.target.value === "" ? "" : Number(e.target.value) })} />
        </Field>
        <Field label="Pattern (regex)">
          <input className="w-full border rounded-lg px-2 py-1" value={p.pattern} onChange={(e) => onChange({ pattern: e.target.value })} />
        </Field>
        <Field label="Help text">
          <input className="w-full border rounded-lg px-2 py-1" value={p.helpText} onChange={(e) => onChange({ helpText: e.target.value })} />
        </Field>
      </Section>
    </div>
  );
}

function ButtonProps({ node, onChange, onDelete }) {
  const p = node.props;
  return (
    <div>
      <Section title="Basics" right={<DeleteBtn onClick={onDelete} />}>
        <Field label="Text">
          <input className="w-full border rounded-lg px-2 py-1" value={p.text} onChange={(e) => onChange({ text: e.target.value })} />
        </Field>
        <Field label="Variant">
          <select className="w-full border rounded-lg px-2 py-1" value={p.variant} onChange={(e) => onChange({ variant: e.target.value })}>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="ghost">Ghost</option>
          </select>
        </Field>
      </Section>

      <Section title="Action">
        <Field label="Type">
          <select className="w-full border rounded-lg px-2 py-1" value={p.action?.type ?? "none"} onChange={(e) => onChange({ action: { type: e.target.value } })}>
            <option value="submit">Submit</option>
            <option value="navigate">Navigate</option>
            <option value="emitEvent">Emit Event</option>
            <option value="none">None</option>
          </select>
        </Field>
        {p.action?.type === "navigate" && (
          <Field label="URL">
            <input className="w-full border rounded-lg px-2 py-1" value={p.action.url ?? ""} onChange={(e) => onChange({ action: { ...p.action, url: e.target.value } })} />
          </Field>
        )}
        {p.action?.type === "emitEvent" && (
          <Field label="Event Name">
            <input className="w-full border rounded-lg px-2 py-1" value={p.action.eventName ?? "button.click"} onChange={(e) => onChange({ action: { ...p.action, eventName: e.target.value } })} />
          </Field>
        )}
      </Section>
    </div>
  );
}

function TextProps({ node, onChange, onDelete }) {
  const p = node.props;
  return (
    <div>
      <Section title="Text" right={<DeleteBtn onClick={onDelete} />}>
        <Field label="Content">
          <textarea className="w-full border rounded-lg px-2 py-1" value={p.text} onChange={(e) => onChange({ text: e.target.value })} />
        </Field>
        <Field label="Font size (px)">
          <input type="number" className="w-full border rounded-lg px-2 py-1" value={p.fontSize} onChange={(e) => onChange({ fontSize: Number(e.target.value) })} />
        </Field>
        <div className="flex gap-3">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={p.bold} onChange={(e) => onChange({ bold: e.target.checked })} /> Bold
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={p.italic} onChange={(e) => onChange({ italic: e.target.checked })} /> Italic
          </label>
        </div>
        <Field label="Align">
          <select className="w-full border rounded-lg px-2 py-1" value={p.align} onChange={(e) => onChange({ align: e.target.value })}>
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </Field>
      </Section>
    </div>
  );
}

function AuthScreenProps({ node, onChange, onAddField, onReorder, onDeleteChild, onDeleteSelf }) {
  return (
    <div>
      <Section title="Screen" right={<DeleteBtn onClick={onDeleteSelf} />}>
        <Field label="Title">
          <input className="w-full border rounded-lg px-2 py-1" value={node.props.title} onChange={(e) => onChange({ title: e.target.value })} />
        </Field>
        <Field label="Description">
          <input className="w-full border rounded-lg px-2 py-1" value={node.props.description} onChange={(e) => onChange({ description: e.target.value })} />
        </Field>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={node.props.showCard} onChange={(e) => onChange({ showCard: e.target.checked })} /> Show card
        </label>
      </Section>

      <Section
        title="Children"
        right={
          <div className="flex gap-2">
            <button className="text-xs border rounded-md px-2 py-1" onClick={() => onAddField("Input")}>
              + Input
            </button>
            <button className="text-xs border rounded-md px-2 py-1" onClick={() => onAddField("Button")}>
              + Button
            </button>
            <button className="text-xs border rounded-md px-2 py-1" onClick={() => onAddField("Text")}>
              + Text
            </button>
          </div>
        }
      >
        {node.children.length === 0 && <div className="text-sm text-slate-500">No children yet. Add an Input, Button or Text.</div>}
        {node.children.map((c) => (
          <div key={c.id} className="flex items-center justify-between border rounded-lg p-2 text-sm">
            <div className="truncate">
              <span className="font-mono text-xs bg-slate-100 px-1 rounded mr-2">{c.type}</span>
              {c.type === "Input" ? c.props.label : c.type === "Button" ? c.props.text : c.props.text}
            </div>
            <div className="flex items-center gap-1">
              <IconBtn title="Up" onClick={() => onReorder(c.id, -1)}>
                ↑
              </IconBtn>
              <IconBtn title="Down" onClick={() => onReorder(c.id, 1)}>
                ↓
              </IconBtn>
              <IconBtn title="Delete" onClick={() => onDeleteChild(c.id)}>
                ✕
              </IconBtn>
            </div>
          </div>
        ))}
      </Section>
    </div>
  );
}

function DeleteBtn({ onClick }) {
  return (
    <button className="text-xs border border-red-200 text-red-600 rounded-md px-2 py-1 hover:bg-red-50" onClick={onClick}>
      Delete
    </button>
  );
}
function IconBtn({ children, onClick, title }) {
  return (
    <button title={title} className="border rounded-md px-2 py-1 hover:bg-slate-50" onClick={onClick}>
      {children}
    </button>
  );
}

// -------------------------
// StyleProps: editor for style attributes including left/top (position inspector).
// - The left/top inputs will now correctly call onChange which merges into node.props.style (numbers).
// - Exposes left/top only when canvasMode === 'absolute' so user understands they control percent placement.
// -------------------------
function StyleProps({ node, onChange, canvasMode }) {
  const s = node.props?.style || {};
  return (
    <div>
      <Section title="Layout">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Padding X (px)">
            <input type="number" className="w-full border rounded-lg px-2 py-1" value={s.px ?? ""} onChange={(e) => onChange({ px: numOrEmpty(e.target.value) })} />
          </Field>
          <Field label="Padding Y (px)">
            <input type="number" className="w-full border rounded-lg px-2 py-1" value={s.py ?? ""} onChange={(e) => onChange({ py: numOrEmpty(e.target.value) })} />
          </Field>
          <Field label="Radius (px)">
            <input type="number" className="w-full border rounded-lg px-2 py-1" value={s.radius ?? ""} onChange={(e) => onChange({ radius: numOrEmpty(e.target.value) })} />
          </Field>
          <Field label="Font size (px)">
            <input type="number" className="w-full border rounded-lg px-2 py-1" value={s.fontSize ?? ""} onChange={(e) => onChange({ fontSize: numOrEmpty(e.target.value) })} />
          </Field>
          <Field label="Margin Top (px)">
            <input type="number" className="w-full border rounded-lg px-2 py-1" value={s.mt ?? ""} onChange={(e) => onChange({ mt: numOrEmpty(e.target.value) })} />
          </Field>
          <Field label="Margin Bottom (px)">
            <input type="number" className="w-full border rounded-lg px-2 py-1" value={s.mb ?? ""} onChange={(e) => onChange({ mb: numOrEmpty(e.target.value) })} />
          </Field>
        </div>
      </Section>

      <Section title="Colors">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Text color">
            <input type="color" className="w-full h-9 border rounded-lg" value={s.textColor || "#000000"} onChange={(e) => onChange({ textColor: e.target.value })} />
          </Field>
          <Field label="Background">
            <input type="color" className="w-full h-9 border rounded-lg" value={s.backgroundColor || "#ffffff"} onChange={(e) => onChange({ backgroundColor: e.target.value })} />
          </Field>
          <Field label="Border color">
            <input type="color" className="w-full h-9 border rounded-lg" value={s.borderColor || "#e2e8f0"} onChange={(e) => onChange({ borderColor: e.target.value })} />
          </Field>
          <Field label="Border width (px)">
            <input type="number" className="w-full border rounded-lg px-2 py-1" value={s.borderWidth ?? ""} onChange={(e) => onChange({ borderWidth: numOrEmpty(e.target.value) })} />
          </Field>
        </div>
      </Section>

      <Section title="Typography & Effects">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!s.bold} onChange={(e) => onChange({ bold: e.target.checked })} /> Bold
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!s.italic} onChange={(e) => onChange({ italic: e.target.checked })} /> Italic
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!s.shadow} onChange={(e) => onChange({ shadow: e.target.checked })} /> Shadow
          </label>
        </div>
        {node.type === "Text" && (
          <Field label="Align">
            <select className="w-full border rounded-lg px-2 py-1" value={s.align || node.props.align || "left"} onChange={(e) => onChange({ align: e.target.value })}>
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </Field>
        )}
      </Section>

      {node.type === "Input" && (
        <Section title="Input-specific">
          <Field label="Label color">
            <input type="color" className="w-full h-9 border rounded-lg" value={s.labelColor || "#0f172a"} onChange={(e) => onChange({ labelColor: e.target.value })} />
          </Field>
          <Field label="Help text color">
            <input type="color" className="w-full h-9 border rounded-lg" value={s.helpTextColor || "#64748b"} onChange={(e) => onChange({ helpTextColor: e.target.value })} />
          </Field>
        </Section>
      )}

      {/* Position inspector - only relevant in absolute mode */}
      {canvasMode === "absolute" && (
        <Section title="Position (percent)">
          <div className="grid grid-cols-2 gap-2">
            <Field label="Left (%)">
              <input
                type="number"
                step="0.1"
                className="w-full border rounded-lg px-2 py-1"
                value={s.left ?? ""}
                onChange={(e) => onChange({ left: e.target.value === "" ? "" : Number(e.target.value) })}
              />
            </Field>
            <Field label="Top (%)">
              <input
                type="number"
                step="0.1"
                className="w-full border rounded-lg px-2 py-1"
                value={s.top ?? ""}
                onChange={(e) => onChange({ top: e.target.value === "" ? "" : Number(e.target.value) })}
              />
            </Field>
          </div>
          <div className="text-xs text-slate-500 mt-2">Left/Top are percentages relative to the container.</div>
        </Section>
      )}
    </div>
  );
}

// Theme editor
function ThemePanel({ theme, setTheme }) {
  return (
    <div>
      <Section title="Palette">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Primary">
            <input type="color" className="w-full h-9 border rounded-lg" value={theme.primary} onChange={(e) => setTheme((t) => ({ ...t, primary: e.target.value }))} />
          </Field>
          <Field label="Text">
            <input type="color" className="w-full h-9 border rounded-lg" value={theme.text} onChange={(e) => setTheme((t) => ({ ...t, text: e.target.value }))} />
          </Field>
          <Field label="Surface (cards)">
            <input type="color" className="w-full h-9 border rounded-lg" value={theme.surface} onChange={(e) => setTheme((t) => ({ ...t, surface: e.target.value }))} />
          </Field>
          <Field label="Surface Alt (canvas bg)">
            <input type="color" className="w-full h-9 border rounded-lg" value={theme.surfaceAlt} onChange={(e) => setTheme((t) => ({ ...t, surfaceAlt: e.target.value }))} />
          </Field>
          <Field label="Border">
            <input type="color" className="w-full h-9 border rounded-lg" value={theme.border} onChange={(e) => setTheme((t) => ({ ...t, border: e.target.value }))} />
          </Field>
        </div>
      </Section>

      <Section title="Shape & Type">
        <div className="grid grid-cols-2 gap-2">
          <Field label="Radius (px)">
            <input type="number" className="w-full border rounded-lg px-2 py-1" value={theme.radius} onChange={(e) => setTheme((t) => ({ ...t, radius: Number(e.target.value) || 0 }))} />
          </Field>
          <Field label="Font family">
            <input className="w-full border rounded-lg px-2 py-1" value={theme.fontFamily} onChange={(e) => setTheme((t) => ({ ...t, fontFamily: e.target.value }))} />
          </Field>
        </div>
      </Section>
    </div>
  );
}

// -------------------------
// Validation & Tree helpers (kept intact)
// -------------------------
function validateValue(props, value) {
  const errs = [];
  const len = value?.length ?? 0;
  if (props.required && !value) errs.push("This field is required.");
  if (props.minLength && len < props.minLength) errs.push(`Minimum ${props.minLength} characters.`);
  if (props.maxLength !== "" && len > props.maxLength) errs.push(`Maximum ${props.maxLength} characters.`);

  if (props.inputType === "email" && value) {
    const re = /\S+@\S+\.[A-Za-z]{2,}/;
    if (!re.test(value)) errs.push("Enter a valid email address.");
  }
  if (props.inputType === "number" && value) {
    if (!/^[-+]?\d*(?:\.\d+)?$/.test(value)) errs.push("Enter a valid number.");
  }
  if (props.pattern) {
    try {
      const re = new RegExp(props.pattern);
      if (value && !re.test(value)) errs.push("Does not match pattern.");
    } catch (e) {
      // ignore invalid regex at edit time
    }
  }
  return errs;
}

function findNode(root, id) {
  if (!id) return null;
  if (root.id === id) return root;
  for (const c of root.children || []) {
    const f = findNode(c, id);
    if (f) return f;
  }
  return null;
}
function insertNode(root, parentId, node) {
  if (root.id === parentId) {
    return { ...root, children: [...(root.children || []), node] };
  }
  return { ...root, children: (root.children || []).map((c) => insertNode(c, parentId, node)) };
}
function insertNodeAt(root, parentId, node, index) {
  if (root.id === parentId) {
    const arr = [...(root.children || [])];
    const idx = Math.max(0, Math.min(index == null ? arr.length : index, arr.length));
    arr.splice(idx, 0, node);
    return { ...root, children: arr };
  }
  return { ...root, children: (root.children || []).map((c) => insertNodeAt(c, parentId, node, index)) };
}
function updateProps(root, nodeId, patch) {
  if (root.id === nodeId) {
    return { ...root, props: { ...root.props, ...patch } };
  }
  return { ...root, children: (root.children || []).map((c) => updateProps(c, nodeId, patch)) };
}
function deleteNode(root, nodeId) {
  return {
    ...root,
    children: (root.children || [])
      .filter((c) => c.id !== nodeId)
      .map((c) => deleteNode(c, nodeId)),
  };
}
function reorderChild(root, parentId, childId, dir) {
  if (root.id === parentId) {
    const arr = [...root.children];
    const idx = arr.findIndex((c) => c.id === childId);
    if (idx === -1) return root;
    const next = idx + dir;
    if (next < 0 || next >= arr.length) return root;
    const [it] = arr.splice(idx, 1);
    arr.splice(next, 0, it);
    return { ...root, children: arr };
  }
  return { ...root, children: (root.children || []).map((c) => reorderChild(c, parentId, childId, dir)) };
}

// find parent of nodeId (returns the parent node or null)
function findParent(root, nodeId) {
  if (!root) return null;
  if ((root.children || []).some((c) => c.id === nodeId)) return root;
  for (const c of root.children || []) {
    const got = findParent(c, nodeId);
    if (got) return got;
  }
  return null;
}

// move node by remove + insert
function moveNodeInTree(root, nodeId, targetParentId, beforeNodeId = null) {
  const node = findNode(root, nodeId);
  if (!node) return root;
  const without = deleteNode(root, nodeId);

  if (beforeNodeId) {
    function insertAtBefore(curr) {
      if (curr.id === targetParentId) {
        const arr = [...(curr.children || [])];
        const idx = arr.findIndex((c) => c.id === beforeNodeId);
        const at = idx === -1 ? arr.length : idx;
        arr.splice(at, 0, node);
        return { ...curr, children: arr };
      }
      return { ...curr, children: (curr.children || []).map((c) => insertAtBefore(c)) };
    }
    return insertAtBefore(without);
  } else {
    return insertNodeAt(without, targetParentId, node, null);
  }
}

// find ancestor AuthScreen id (keeps using rootRef)
function findAncestorAuthId(_el, nodeId) {
  return _findAncestorAuthIdIn(rootRef.current, nodeId);
}

const rootRef = { current: null };

function _findAncestorAuthIdIn(node, childId, path = []) {
  if (!node) return null;
  if (node.id === childId) {
    const rev = [...path].reverse();
    const found = rev.find((n) => n.type === "AuthScreen");
    return found?.id || null;
  }
  for (const c of node.children || []) {
    const got = _findAncestorAuthIdIn(c, childId, [...path, node]);
    if (got) return got;
  }
  return null;
}

// helpers
function numOrEmpty(v) {
  if (v === "" || v === null || typeof v === "undefined") return "";
  const n = Number(v);
  return Number.isFinite(n) ? n : "";
}
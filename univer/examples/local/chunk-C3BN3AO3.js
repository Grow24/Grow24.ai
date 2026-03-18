import {
  AddCommentCommand,
  DeleteCommentCommand,
  DeleteCommentTreeCommand,
  ResolveCommentCommand,
  ThreadCommentModel,
  UniverThreadCommentPlugin,
  UpdateCommentCommand,
  getDT
} from "./chunk-7I7VZCGI.js";
import {
  BreakLineCommand,
  IEditorService,
  RichTextEditor
} from "./chunk-PAANS7B4.js";
import {
  Button,
  DeleteIcon,
  Dropdown,
  ISidebarService,
  IncreaseIcon,
  MoreHorizontalIcon,
  ReplyToCommentIcon,
  ResolvedIcon,
  Select,
  SolveIcon,
  Tooltip,
  UI_PLUGIN_CONFIG_KEY,
  borderClassName,
  clsx,
  require_jsx_runtime,
  require_react,
  scrollbarClassName,
  useConfigValue,
  useDependency,
  useObservable
} from "./chunk-CSPB4B6P.js";
import {
  BehaviorSubject,
  BuildTextUtils,
  DOCS_COMMENT_EDITOR_UNIT_ID_KEY,
  DOCS_NORMAL_EDITOR_UNIT_ID_KEY,
  DependentOn,
  Disposable,
  ICommandService,
  IConfigService,
  IUniverInstanceService,
  Inject,
  Injector,
  LocaleService,
  O,
  Plugin,
  Tools,
  UserManagerService,
  debounceTime,
  filter,
  generateRandomId,
  getBodySlice,
  mergeOverrideWithDependencies,
  merge_default
} from "./chunk-ZRYQFDHJ.js";
import {
  __decorateClass,
  __decorateParam,
  __publicField,
  __toESM
} from "./chunk-NSSCU2QI.js";

// ../packages/thread-comment-ui/src/services/thread-comment-panel.service.ts
var ThreadCommentPanelService = class extends Disposable {
  constructor(_sidebarService, _univerInstanceService) {
    super();
    this._sidebarService = _sidebarService;
    this._univerInstanceService = _univerInstanceService;
    __publicField(this, "_panelVisible", false);
    __publicField(this, "_panelVisible$", new BehaviorSubject(false));
    __publicField(this, "_activeCommentId");
    __publicField(this, "_activeCommentId$", new BehaviorSubject(void 0));
    __publicField(this, "panelVisible$", this._panelVisible$.asObservable());
    __publicField(this, "activeCommentId$", this._activeCommentId$.asObservable());
    this._init();
    this.disposeWithMe(() => {
      this._activeCommentId$.complete();
      this._panelVisible$.complete();
    });
  }
  _init() {
    this.disposeWithMe(
      this._sidebarService.sidebarOptions$.subscribe((opt) => {
        if (!opt.visible) {
          this.setPanelVisible(false);
        }
      })
    );
    this.disposeWithMe(
      this._univerInstanceService.getCurrentTypeOfUnit$(O.UNIVER_SHEET).pipe(filter((sheet) => !sheet)).subscribe(() => {
        this._sidebarService.close();
      })
    );
  }
  get panelVisible() {
    return this._panelVisible;
  }
  get activeCommentId() {
    return this._activeCommentId;
  }
  setPanelVisible(visible) {
    this._panelVisible = visible;
    this._panelVisible$.next(visible);
  }
  setActiveComment(commentInfo) {
    this._activeCommentId = commentInfo;
    this._activeCommentId$.next(commentInfo);
  }
};
ThreadCommentPanelService = __decorateClass([
  __decorateParam(0, Inject(ISidebarService)),
  __decorateParam(1, IUniverInstanceService)
], ThreadCommentPanelService);

// ../packages/thread-comment-ui/src/types/const.ts
var THREAD_COMMENT_PANEL = "thread-comment-panel";
var PLUGIN_NAME = "UNIVER_THREAD_COMMENT_UI_PLUGIN";

// ../packages/thread-comment-ui/src/commands/operations/comment.operations.ts
var ToggleSheetCommentPanelOperation = {
  id: "thread-comment-ui.operation.toggle-panel",
  type: 1 /* OPERATION */,
  handler(accessor) {
    const sidebarService = accessor.get(ISidebarService);
    const panelService = accessor.get(ThreadCommentPanelService);
    if (panelService.panelVisible) {
      sidebarService.close();
      panelService.setPanelVisible(false);
    } else {
      sidebarService.open({
        header: { title: "threadCommentUI.panel.title" },
        children: { label: THREAD_COMMENT_PANEL },
        width: 330
      });
      panelService.setPanelVisible(true);
    }
    return true;
  }
};
var SetActiveCommentOperation = {
  id: "thread-comment-ui.operation.set-active-comment",
  type: 1 /* OPERATION */,
  handler(accessor, params) {
    const panelService = accessor.get(ThreadCommentPanelService);
    panelService.setActiveComment(params);
    return true;
  }
};

// ../packages/thread-comment-ui/src/controllers/config.schema.ts
var THREAD_COMMENT_UI_PLUGIN_CONFIG_KEY = "thread-comment-ui.config";
var configSymbol = Symbol(THREAD_COMMENT_UI_PLUGIN_CONFIG_KEY);
var defaultPluginConfig = {};

// ../packages/thread-comment-ui/src/plugin.ts
var UniverThreadCommentUIPlugin = class extends Plugin {
  constructor(_config = defaultPluginConfig, _injector, _commandService, _configService) {
    super();
    this._config = _config;
    this._injector = _injector;
    this._commandService = _commandService;
    this._configService = _configService;
    const { menu, ...rest } = merge_default(
      {},
      defaultPluginConfig,
      this._config
    );
    if (menu) {
      this._configService.setConfig("menu", menu, { merge: true });
    }
    this._configService.setConfig(THREAD_COMMENT_UI_PLUGIN_CONFIG_KEY, rest);
  }
  onStarting() {
    var _a;
    mergeOverrideWithDependencies([
      [ThreadCommentPanelService]
    ], (_a = this._config) == null ? void 0 : _a.overrides).forEach((dep) => {
      this._injector.add(dep);
    });
    [ToggleSheetCommentPanelOperation, SetActiveCommentOperation].forEach((command) => {
      this._commandService.registerCommand(command);
    });
  }
};
__publicField(UniverThreadCommentUIPlugin, "pluginName", PLUGIN_NAME);
__publicField(UniverThreadCommentUIPlugin, "type", O.UNIVER_UNKNOWN);
UniverThreadCommentUIPlugin = __decorateClass([
  DependentOn(UniverThreadCommentPlugin),
  __decorateParam(1, Inject(Injector)),
  __decorateParam(2, ICommandService),
  __decorateParam(3, IConfigService)
], UniverThreadCommentUIPlugin);

// ../packages/thread-comment-ui/src/views/thread-comment-panel/index.tsx
var import_react3 = __toESM(require_react());

// ../packages/thread-comment-ui/src/views/thread-comment-tree/index.tsx
var import_react2 = __toESM(require_react());

// ../packages/thread-comment-ui/src/views/thread-comment-editor/index.tsx
var import_react = __toESM(require_react());
var import_jsx_runtime = __toESM(require_jsx_runtime());
function getSnapshot(body) {
  return {
    id: "d",
    body,
    documentStyle: {}
  };
}
var ThreadCommentEditor = (0, import_react.forwardRef)((props, ref) => {
  var _a;
  const { comment, onSave, id, onCancel, autoFocus, unitId, type } = props;
  const commandService = useDependency(ICommandService);
  const localeService = useDependency(LocaleService);
  const [editing, setEditing] = (0, import_react.useState)(false);
  const editorService = useDependency(IEditorService);
  const editor = (0, import_react.useRef)(null);
  const rootEditorId = type === O.UNIVER_DOC ? DOCS_NORMAL_EDITOR_UNIT_ID_KEY : unitId;
  const [canSubmit, setCanSubmit] = (0, import_react.useState)(() => {
    var _a2, _b, _c;
    return BuildTextUtils.transform.getPlainText((_c = (_b = (_a2 = editor.current) == null ? void 0 : _a2.getDocumentData().body) == null ? void 0 : _b.dataStream) != null ? _c : "");
  });
  (0, import_react.useEffect)(() => {
    var _a2, _b, _c, _d;
    setCanSubmit(BuildTextUtils.transform.getPlainText((_c = (_b = (_a2 = editor.current) == null ? void 0 : _a2.getDocumentData().body) == null ? void 0 : _b.dataStream) != null ? _c : ""));
    const sub = (_d = editor.current) == null ? void 0 : _d.selectionChange$.subscribe(() => {
      var _a3, _b2, _c2;
      setCanSubmit(BuildTextUtils.transform.getPlainText((_c2 = (_b2 = (_a3 = editor.current) == null ? void 0 : _a3.getDocumentData().body) == null ? void 0 : _b2.dataStream) != null ? _c2 : ""));
    });
    return () => sub == null ? void 0 : sub.unsubscribe();
  }, [(_a = editor.current) == null ? void 0 : _a.selectionChange$]);
  const keyboardEventConfig = (0, import_react.useMemo)(() => ({
    keyCodes: [{ keyCode: 13 /* ENTER */ }],
    handler: (keyCode) => {
      if (keyCode === 13 /* ENTER */) {
        commandService.executeCommand(
          BreakLineCommand.id
        );
      }
    }
  }), [commandService]);
  (0, import_react.useImperativeHandle)(ref, () => ({
    reply(text) {
      var _a2, _b;
      if (!editor.current) {
        return;
      }
      editorService.focus((_a2 = editor.current.getEditorId()) != null ? _a2 : "");
      const documentData = getSnapshot(text);
      (_b = editor.current) == null ? void 0 : _b.setDocumentData(documentData, [{
        startOffset: documentData.body.dataStream.length - 2,
        endOffset: documentData.body.dataStream.length - 2,
        collapsed: true
      }]);
    }
  }));
  const handleSave = () => {
    if (editor.current) {
      const newText = Tools.deepClone(editor.current.getDocumentData().body);
      setEditing(false);
      onSave == null ? void 0 : onSave({
        ...comment,
        text: newText
      });
      editor.current.replaceText("");
      setTimeout(() => {
        var _a2, _b;
        (_a2 = editor.current) == null ? void 0 : _a2.setSelectionRanges([]);
        (_b = editor.current) == null ? void 0 : _b.blur();
      }, 10);
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { onClick: (e) => e.preventDefault(), children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RichTextEditor,
      {
        className: "univer-w-full",
        editorRef: editor,
        editorId: DOCS_COMMENT_EDITOR_UNIT_ID_KEY,
        autoFocus,
        keyboardEventConfig,
        placeholder: localeService.t("threadCommentUI.editor.placeholder"),
        initialValue: (comment == null ? void 0 : comment.text) && getSnapshot(comment.text),
        onFocusChange: (isFocus) => isFocus && setEditing(isFocus),
        isSingle: false,
        maxHeight: 64,
        onClickOutside: () => {
          setTimeout(() => {
            editorService.focus(rootEditorId);
          }, 30);
        }
      }
    ),
    editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "univer-mt-3 univer-flex univer-flex-row univer-justify-end univer-gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Button,
        {
          onClick: () => {
            var _a2;
            onCancel == null ? void 0 : onCancel();
            setEditing(false);
            (_a2 = editor.current) == null ? void 0 : _a2.replaceText("", true);
            commandService.executeCommand(SetActiveCommentOperation.id);
          },
          children: localeService.t("threadCommentUI.editor.cancel")
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Button,
        {
          variant: "primary",
          disabled: !canSubmit,
          onClick: handleSave,
          children: localeService.t(id ? "threadCommentUI.editor.save" : "threadCommentUI.editor.reply")
        }
      )
    ] }) : null
  ] });
});

// ../packages/thread-comment-ui/src/views/thread-comment-editor/util.ts
var transformDocument2TextNodesInParagraph = (doc) => {
  const { dataStream, customRanges } = doc;
  const end = dataStream.endsWith("\r\n") ? dataStream.length - 2 : dataStream.length;
  const textNodes = [];
  let lastIndex = 0;
  customRanges == null ? void 0 : customRanges.forEach((range) => {
    if (lastIndex < range.startIndex) {
      textNodes.push({
        type: "text",
        content: dataStream.slice(lastIndex, range.startIndex)
      });
    }
    textNodes.push({
      type: "mention",
      content: {
        label: dataStream.slice(range.startIndex, range.endIndex + 1),
        id: range.rangeId
      }
    });
    lastIndex = range.endIndex + 1;
  });
  textNodes.push({
    type: "text",
    content: dataStream.slice(lastIndex, end)
  });
  return textNodes;
};
var transformDocument2TextNodes = (doc) => {
  const { paragraphs = [] } = doc;
  let lastIndex = 0;
  return paragraphs.map((paragraph) => {
    const body = getBodySlice(doc, lastIndex, paragraph.startIndex);
    lastIndex = paragraph.startIndex + 1;
    return transformDocument2TextNodesInParagraph(body);
  });
};
var transformTextNodes2Document = (nodes) => {
  let str = "";
  const customRanges = [];
  nodes.forEach((node) => {
    switch (node.type) {
      case "text":
        str += node.content;
        break;
      case "mention": {
        const start = str.length;
        str += node.content.label;
        const end = str.length - 1;
        customRanges.push({
          rangeId: node.content.id,
          rangeType: 6 /* MENTION */,
          startIndex: start,
          endIndex: end,
          properties: {},
          wholeEntity: true
        });
        break;
      }
      default:
        break;
    }
  });
  str += "\r\n";
  return {
    textRuns: [],
    paragraphs: [
      {
        startIndex: str.length - 2,
        paragraphStyle: {}
      }
    ],
    sectionBreaks: [
      {
        startIndex: str.length - 1
      }
    ],
    dataStream: str,
    customRanges
  };
};

// ../packages/thread-comment-ui/src/views/thread-comment-tree/index.tsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime());
var MOCK_ID = "__mock__";
var ThreadCommentItem = (props) => {
  const { item, unitId, subUnitId, editing, onEditingChange, onReply, resolved, isRoot, onClose, onDeleteComment, type } = props;
  const commandService = useDependency(ICommandService);
  const localeService = useDependency(LocaleService);
  const userManagerService = useDependency(UserManagerService);
  const user = userManagerService.getUser(item.personId);
  const currentUser = useObservable(userManagerService.currentUser$);
  const isCommentBySelf = (currentUser == null ? void 0 : currentUser.userID) === item.personId;
  const isMock = item.id === MOCK_ID;
  const [showReply, setShowReply] = (0, import_react2.useState)(false);
  const uiConfig = useConfigValue(UI_PLUGIN_CONFIG_KEY);
  const avatarFallback = uiConfig == null ? void 0 : uiConfig.avatarFallback;
  const handleDeleteItem = () => {
    if ((onDeleteComment == null ? void 0 : onDeleteComment(item)) === false) {
      return;
    }
    commandService.executeCommand(
      isRoot ? DeleteCommentTreeCommand.id : DeleteCommentCommand.id,
      {
        unitId,
        subUnitId,
        commentId: item.id
      }
    );
    if (isRoot) {
      onClose == null ? void 0 : onClose();
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "univer-relative univer-mb-3 univer-pl-[30px]", onMouseLeave: () => setShowReply(false), onMouseEnter: () => setShowReply(true), children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        className: `univer-absolute univer-left-0 univer-top-0 univer-h-6 univer-w-6 univer-rounded-full univer-bg-cover univer-bg-center univer-bg-no-repeat`,
        style: {
          backgroundImage: `url(${(user == null ? void 0 : user.avatar) || avatarFallback})`
        }
      }
    ),
    user ? /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "univer-mb-1 univer-flex univer-h-6 univer-items-center univer-justify-between", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "univer-text-sm univer-font-medium univer-leading-5", children: (user == null ? void 0 : user.name) || " " }),
      /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { children: [
        isMock || resolved ? null : showReply && user ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            className: `univer-ml-1 univer-inline-flex univer-h-6 univer-w-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded-sm univer-text-base hover:univer-bg-gray-50`,
            onClick: () => onReply(user),
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ReplyToCommentIcon, {})
          }
        ) : null,
        isCommentBySelf && !isMock && !resolved ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          Dropdown,
          {
            overlay: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "univer-rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
              "ul",
              {
                className: `univer-m-0 univer-box-border univer-grid univer-list-none univer-p-1.5 univer-text-sm [&_a]:univer-block [&_a]:univer-cursor-pointer [&_a]:univer-rounded [&_a]:univer-px-2 [&_a]:univer-py-1.5 [&_a]:univer-transition-colors`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "a",
                    {
                      className: "hover:univer-bg-gray-200",
                      onClick: () => onEditingChange == null ? void 0 : onEditingChange(true),
                      children: localeService.t("threadCommentUI.item.edit")
                    }
                  ) }),
                  /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                    "a",
                    {
                      className: "hover:univer-bg-gray-200",
                      onClick: handleDeleteItem,
                      children: localeService.t("threadCommentUI.item.delete")
                    }
                  ) })
                ]
              }
            ) }),
            children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
              "div",
              {
                className: `univer-ml-1 univer-inline-flex univer-h-6 univer-w-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded-sm univer-text-base hover:univer-bg-gray-50`,
                children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(MoreHorizontalIcon, {})
              }
            )
          }
        ) : null
      ] })
    ] }) : null,
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "time",
      {
        className: `univer-mb-1 univer-text-xs/normal univer-text-gray-600 dark:!univer-text-gray-200`,
        children: item.dT
      }
    ),
    editing ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      ThreadCommentEditor,
      {
        type,
        id: item.id,
        comment: item,
        onCancel: () => onEditingChange == null ? void 0 : onEditingChange(false),
        autoFocus: true,
        unitId,
        subUnitId,
        onSave: ({ text, attachments }) => {
          onEditingChange == null ? void 0 : onEditingChange(false);
          commandService.executeCommand(
            UpdateCommentCommand.id,
            {
              unitId,
              subUnitId,
              payload: {
                commentId: item.id,
                text,
                attachments
              }
            }
          );
        }
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "div",
      {
        className: `univer-text-sm univer-text-gray-900 dark:!univer-text-white`,
        children: transformDocument2TextNodes(item.text).map((paragraph, i) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { className: "univer-break-words", children: paragraph.map((item2, i2) => {
          switch (item2.type) {
            case "mention":
              return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("a", { className: "univer-text-primary-600", children: [
                item2.content.label,
                " "
              ] }, i2);
            default:
              return item2.content;
          }
        }) }, i))
      }
    )
  ] });
};
var ThreadCommentTree = (props) => {
  var _a, _b, _c;
  const {
    id,
    unitId,
    subUnitId,
    refStr,
    showEdit = true,
    onClick,
    showHighlight,
    onClose,
    getSubUnitName,
    prefix,
    autoFocus,
    onMouseEnter,
    onMouseLeave,
    onAddComment,
    onDeleteComment,
    onResolve,
    type,
    style,
    full
  } = props;
  const threadCommentModel = useDependency(ThreadCommentModel);
  const [isHover, setIsHover] = (0, import_react2.useState)(false);
  const [editingId, setEditingId] = (0, import_react2.useState)("");
  const updte$ = (0, import_react2.useMemo)(() => threadCommentModel.commentUpdate$.pipe(debounceTime(16)), [threadCommentModel]);
  useObservable(updte$);
  const comments = id ? threadCommentModel.getCommentWithChildren(unitId, subUnitId, id) : null;
  const commandService = useDependency(ICommandService);
  const userManagerService = useDependency(UserManagerService);
  const resolved = comments == null ? void 0 : comments.root.resolved;
  const currentUser = useObservable(userManagerService.currentUser$);
  const editorRef = (0, import_react2.useRef)(null);
  const renderComments = [
    ...comments ? [comments.root] : (
      // mock empty comment
      [{
        id: MOCK_ID,
        text: {
          dataStream: "\n\r"
        },
        personId: (_a = currentUser == null ? void 0 : currentUser.userID) != null ? _a : "",
        ref: refStr != null ? refStr : "",
        dT: "",
        unitId,
        subUnitId,
        threadId: ""
      }]
    ),
    ...(_b = comments == null ? void 0 : comments.children) != null ? _b : []
  ];
  const scroller = (0, import_react2.useRef)(null);
  const handleResolve = (e) => {
    e.stopPropagation();
    if (!resolved) {
      commandService.executeCommand(SetActiveCommentOperation.id);
    } else {
      commandService.executeCommand(SetActiveCommentOperation.id, {
        unitId,
        subUnitId,
        commentId: id
      });
    }
    commandService.executeCommand(ResolveCommentCommand.id, {
      unitId,
      subUnitId,
      commentId: id,
      resolved: !resolved
    });
    onResolve == null ? void 0 : onResolve(!resolved);
  };
  const handleDeleteRoot = (e) => {
    e.stopPropagation();
    commandService.executeCommand(SetActiveCommentOperation.id);
    if ((comments == null ? void 0 : comments.root) && (onDeleteComment == null ? void 0 : onDeleteComment(comments.root)) === false) {
      return;
    }
    commandService.executeCommand(
      DeleteCommentTreeCommand.id,
      {
        unitId,
        subUnitId,
        commentId: id
      }
    );
    onClose == null ? void 0 : onClose();
  };
  (0, import_react2.useEffect)(() => {
    return onMouseLeave == null ? void 0 : onMouseLeave();
  }, []);
  const subUnitName = getSubUnitName((_c = comments == null ? void 0 : comments.root.subUnitId) != null ? _c : subUnitId);
  const editorVisible = showEdit && !editingId && !resolved;
  const title = `${refStr || (comments == null ? void 0 : comments.root.ref) || ""}${subUnitName ? " \xB7 " : ""}${subUnitName}`;
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
    "div",
    {
      id: `${prefix}-${unitId}-${subUnitId}-${id}`,
      className: clsx(`univer-relative univer-box-border univer-rounded-md univer-bg-white univer-p-4 dark:!univer-bg-gray-900 dark:!univer-text-white`, borderClassName, {
        "univer-w-[278px]": !full,
        "univer-w-full": full,
        "univer-shadow": !resolved && (showHighlight || isHover || prefix === "cell")
      }),
      style,
      onClick,
      onMouseEnter: () => {
        onMouseEnter == null ? void 0 : onMouseEnter();
        setIsHover(true);
      },
      onMouseLeave: () => {
        onMouseLeave == null ? void 0 : onMouseLeave();
        setIsHover(false);
      },
      children: [
        !resolved && showHighlight && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            className: `univer-absolute univer-left-0 univer-right-0 univer-top-0 univer-h-1.5 univer-rounded-t-md univer-bg-yellow-400`
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
          "div",
          {
            className: `univer-mb-4 univer-flex univer-flex-row univer-items-center univer-justify-between univer-text-sm univer-leading-5`,
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "univer-flex univer-flex-1 univer-flex-row univer-items-center univer-overflow-hidden", children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "div",
                  {
                    className: `univer-mr-2 univer-h-3.5 univer-w-[3px] univer-flex-shrink-0 univer-flex-grow-0 univer-rounded-sm univer-bg-yellow-500`
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Tooltip, { showIfEllipsis: true, title, children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "span",
                  {
                    className: "univer-flex-1 univer-truncate",
                    children: title
                  }
                ) })
              ] }),
              !!comments && /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("div", { className: "univer-flex univer-flex-shrink-0 univer-flex-grow-0 univer-flex-row", children: [
                /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "div",
                  {
                    className: clsx(`univer-ml-1 univer-inline-flex univer-h-6 univer-w-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded-[3px] univer-text-base hover:univer-bg-gray-50 dark:hover:!univer-bg-gray-800`, {
                      "univer-text-green-500": resolved
                    }),
                    onClick: handleResolve,
                    children: resolved ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ResolvedIcon, {}) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(SolveIcon, {})
                  }
                ),
                (currentUser == null ? void 0 : currentUser.userID) === comments.root.personId ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                  "div",
                  {
                    className: `univer-ml-1 univer-inline-flex univer-h-6 univer-w-6 univer-cursor-pointer univer-items-center univer-justify-center univer-rounded-[3px] univer-text-base hover:univer-bg-gray-50 dark:hover:!univer-bg-gray-800`,
                    onClick: handleDeleteRoot,
                    children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(DeleteIcon, {})
                  }
                ) : null
              ] })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          "div",
          {
            ref: scroller,
            className: clsx("univer-max-h-80 univer-overflow-y-auto univer-overflow-x-hidden", scrollbarClassName),
            children: renderComments.map(
              (item) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
                ThreadCommentItem,
                {
                  unitId,
                  subUnitId,
                  item,
                  isRoot: item.id === (comments == null ? void 0 : comments.root.id),
                  editing: editingId === item.id,
                  resolved: comments == null ? void 0 : comments.root.resolved,
                  type,
                  onClose,
                  onEditingChange: (editing) => {
                    if (editing) {
                      setEditingId(item.id);
                    } else {
                      setEditingId("");
                    }
                  },
                  onReply: (user) => {
                    if (!user) {
                      return;
                    }
                    requestAnimationFrame(() => {
                      var _a2;
                      (_a2 = editorRef.current) == null ? void 0 : _a2.reply(transformTextNodes2Document([
                        {
                          type: "mention",
                          content: {
                            id: user.userID,
                            label: `@${user.name}`
                          }
                        },
                        {
                          type: "text",
                          content: " "
                        }
                      ]));
                    });
                  },
                  onAddComment,
                  onDeleteComment
                },
                item.id
              )
            )
          }
        ),
        editorVisible && /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
          ThreadCommentEditor,
          {
            ref: editorRef,
            type,
            unitId,
            subUnitId,
            onSave: async ({ text, attachments }) => {
              const comment = {
                text,
                attachments,
                dT: getDT(),
                id: generateRandomId(),
                ref: refStr,
                personId: currentUser == null ? void 0 : currentUser.userID,
                parentId: comments == null ? void 0 : comments.root.id,
                unitId,
                subUnitId,
                threadId: comments == null ? void 0 : comments.root.threadId
              };
              if ((onAddComment == null ? void 0 : onAddComment(comment)) === false) {
                return;
              }
              await commandService.executeCommand(
                AddCommentCommand.id,
                {
                  unitId,
                  subUnitId,
                  comment
                }
              );
              if (scroller.current) {
                scroller.current.scrollTop = scroller.current.scrollHeight;
              }
            },
            autoFocus: autoFocus || !comments,
            onCancel: () => {
              if (!comments) {
                onClose == null ? void 0 : onClose();
              }
            }
          },
          `${autoFocus}`
        ) })
      ]
    }
  );
};

// ../packages/thread-comment-ui/src/views/thread-comment-panel/index.tsx
var import_jsx_runtime3 = __toESM(require_jsx_runtime());
var ThreadCommentPanel = (props) => {
  const {
    unitId,
    subUnitId$,
    type,
    onAdd,
    getSubUnitName,
    onResolve,
    sortComments,
    onItemLeave,
    onItemEnter,
    disableAdd,
    tempComment,
    onAddComment,
    onDeleteComment,
    showComments
  } = props;
  const [unit, setUnit] = (0, import_react3.useState)("all");
  const [status, setStatus] = (0, import_react3.useState)("all");
  const localeService = useDependency(LocaleService);
  const userService = useDependency(UserManagerService);
  const threadCommentModel = useDependency(ThreadCommentModel);
  const [unitComments, setUnitComments] = (0, import_react3.useState)(() => threadCommentModel.getUnit(unitId));
  const panelService = useDependency(ThreadCommentPanelService);
  const activeCommentId = useObservable(panelService.activeCommentId$);
  const update = useObservable(threadCommentModel.commentUpdate$);
  const commandService = useDependency(ICommandService);
  const subUnitId = useObservable(subUnitId$);
  const shouldScroll = (0, import_react3.useRef)(true);
  const prefix = "panel";
  const currentUser = useObservable(userService.currentUser$);
  const comments = (0, import_react3.useMemo)(() => {
    var _a;
    const allComments = unit === "all" ? unitComments : (_a = unitComments.filter((i) => i.subUnitId === subUnitId)) != null ? _a : [];
    const sort = sortComments != null ? sortComments : ((a) => a);
    const res = allComments.map((i) => {
      var _a2;
      return { ...i.root, children: (_a2 = i.children) != null ? _a2 : [], users: i.relativeUsers };
    });
    if (showComments) {
      const map = /* @__PURE__ */ new Map();
      res.forEach((comment) => {
        map.set(comment.id, comment);
      });
      return [...showComments, ""].map((id) => map.get(id)).filter(Boolean);
    } else {
      return sort(res);
    }
  }, [showComments, unit, unitComments, sortComments, subUnitId]);
  const commentsSorted = (0, import_react3.useMemo)(() => [
    ...comments.filter((comment) => !comment.resolved),
    ...comments.filter((comment) => comment.resolved)
  ], [comments]);
  const statuedComments = (0, import_react3.useMemo)(() => {
    if (status === "resolved") {
      return commentsSorted.filter((comment) => comment.resolved);
    }
    if (status === "unsolved") {
      return commentsSorted.filter((comment) => !comment.resolved);
    }
    if (status === "concern_me") {
      if (!(currentUser == null ? void 0 : currentUser.userID)) {
        return commentsSorted;
      }
      return commentsSorted.filter((comment) => comment == null ? void 0 : comment.users.has(currentUser.userID));
    }
    return commentsSorted;
  }, [commentsSorted, currentUser == null ? void 0 : currentUser.userID, status]);
  const renderComments = tempComment ? [tempComment, ...statuedComments] : statuedComments;
  const unSolvedComments = renderComments.filter((comment) => !comment.resolved);
  const solvedComments = renderComments.filter((comment) => comment.resolved);
  const isFiltering = status !== "all" || unit !== "all";
  const onReset = () => {
    setStatus("all");
    setUnit("all");
  };
  (0, import_react3.useEffect)(() => {
    if (unitId) {
      setUnitComments(
        threadCommentModel.getUnit(unitId)
      );
    }
  }, [unitId, threadCommentModel, update]);
  (0, import_react3.useEffect)(() => {
    var _a;
    if (!activeCommentId) {
      return;
    }
    if (!shouldScroll.current) {
      shouldScroll.current = true;
      return;
    }
    const { unitId: unitId2, subUnitId: subUnitId2, commentId } = activeCommentId;
    const id = `${prefix}-${unitId2}-${subUnitId2}-${commentId}`;
    (_a = document.getElementById(id)) == null ? void 0 : _a.scrollIntoView({ block: "center" });
  }, [activeCommentId]);
  const renderComment = (comment) => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    ThreadCommentTree,
    {
      prefix,
      getSubUnitName,
      id: comment.id,
      unitId: comment.unitId,
      subUnitId: comment.subUnitId,
      refStr: comment.ref,
      type,
      showEdit: (activeCommentId == null ? void 0 : activeCommentId.commentId) === comment.id,
      showHighlight: (activeCommentId == null ? void 0 : activeCommentId.commentId) === comment.id,
      onClick: () => {
        shouldScroll.current = false;
        if (!comment.resolved) {
          commandService.executeCommand(
            SetActiveCommentOperation.id,
            {
              unitId: comment.unitId,
              subUnitId: comment.subUnitId,
              commentId: comment.id,
              temp: false
            }
          );
        } else {
          commandService.executeCommand(SetActiveCommentOperation.id);
        }
      },
      onMouseEnter: () => onItemEnter == null ? void 0 : onItemEnter(comment),
      onMouseLeave: () => onItemLeave == null ? void 0 : onItemLeave(comment),
      onAddComment,
      onDeleteComment,
      onResolve: (resolved) => onResolve == null ? void 0 : onResolve(comment.id, resolved)
    },
    comment.id
  );
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-flex univer-min-h-full univer-flex-col univer-pb-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-mt-3 univer-flex univer-flex-row univer-justify-between", children: [
      type === O.UNIVER_SHEET ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Select,
        {
          borderless: true,
          value: unit,
          options: [
            {
              value: "current",
              label: localeService.t("threadCommentUI.filter.sheet.current")
            },
            {
              value: "all",
              label: localeService.t("threadCommentUI.filter.sheet.all")
            }
          ],
          onChange: setUnit
        }
      ) : null,
      /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
        Select,
        {
          borderless: true,
          value: status,
          options: [
            {
              value: "all",
              label: localeService.t("threadCommentUI.filter.status.all")
            },
            {
              value: "resolved",
              label: localeService.t("threadCommentUI.filter.status.resolved")
            },
            {
              value: "unsolved",
              label: localeService.t("threadCommentUI.filter.status.unsolved")
            },
            {
              value: "concern_me",
              label: localeService.t("threadCommentUI.filter.status.concernMe")
            }
          ],
          onChange: setStatus
        }
      )
    ] }),
    renderComments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(
      "div",
      {
        className: `univer-flex univer-flex-1 univer-flex-col univer-items-center univer-justify-center univer-text-sm univer-text-gray-600 dark:!univer-text-gray-200`,
        children: [
          localeService.t("threadCommentUI.panel.empty"),
          isFiltering ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "univer-mt-2 univer-flex univer-flex-row", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(Button, { onClick: onReset, children: localeService.t("threadCommentUI.panel.reset") }) }) : !disableAdd ? /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "univer-mt-2 univer-flex univer-flex-row", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)(Button, { onClick: onAdd, children: [
            /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(IncreaseIcon, { className: "univer-mr-1.5" }),
            localeService.t("threadCommentUI.panel.addComment")
          ] }) }) : null
        ]
      }
    ) : /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("div", { className: "univer-mt-3 univer-flex univer-flex-col univer-gap-3", children: [
      unSolvedComments.map(renderComment),
      solvedComments.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("div", { className: "univer-text-xs", children: localeService.t("threadCommentUI.panel.solved") }),
      solvedComments.map(renderComment)
    ] })
  ] });
};

export {
  ThreadCommentPanelService,
  THREAD_COMMENT_PANEL,
  ToggleSheetCommentPanelOperation,
  SetActiveCommentOperation,
  UniverThreadCommentUIPlugin,
  ThreadCommentTree,
  ThreadCommentPanel
};
//# sourceMappingURL=chunk-C3BN3AO3.js.map

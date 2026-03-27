import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon,
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo, 
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  Type,
  Minus,
  Plus,
  Printer,
  Search,
  Paintbrush,
  CheckSquare,
  Strikethrough,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useEditorContext } from './EditorContext';

const FONT_FAMILIES = [
  'Arial',
  'Calibri',
  'Comic Sans MS',
  'Courier New',
  'Georgia',
  'Helvetica',
  'Times New Roman',
  'Verdana',
];

const TEXT_COLORS = [
  '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC',
  '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF', '#980000', '#FF0000',
  '#FF9900', '#FFFF00', '#00FF00', '#00FFFF', '#4A86E8', '#0000FF',
  '#9900FF', '#FF00FF',
];

export default function EditorToolbar() {
  const { editor } = useEditorContext();
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor.chain().focus().setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkDialog(false);
    }
  };

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setFontSizeValue = (size: number) => {
    const clampedSize = Math.max(8, Math.min(72, size));
    editor.chain().focus().setMark('textStyle', { fontSize: `${clampedSize}px` }).run();
  };

  const currentFontSize = parseInt(editor.getAttributes('textStyle')?.fontSize || '12px') || 12;
  const currentColor = editor.getAttributes('textStyle')?.color || '#000000';

  return (
    <div className="border-b bg-gray-50">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 flex-wrap">
        {/* Document Actions */}
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Search">
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo"
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo"
          >
            <Redo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => window.print()} title="Print">
            <Printer className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title="Clear formatting"
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Format painter">
            <Paintbrush className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-2">
                100% <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[50, 75, 100, 125, 150, 200].map((zoom) => (
                <DropdownMenuItem key={zoom} onClick={() => {}}>
                  {zoom}%
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Paragraph Style */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-3">
              Normal text <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
              Normal text
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
              Heading 1
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
              Heading 2
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
              Heading 3
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Family */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-3">
              Calibri <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {FONT_FAMILIES.map((font) => (
              <DropdownMenuItem 
                key={font}
                onClick={() => editor.chain().focus().setFontFamily(font).run()}
                style={{ fontFamily: font }}
              >
                {font}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Font Size */}
        <div className="flex items-center border rounded px-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setFontSizeValue(currentFontSize - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <Input
            type="number"
            value={currentFontSize}
            onChange={(e) => setFontSizeValue(parseInt(e.target.value) || 12)}
            className="h-6 w-12 text-center border-0 p-0 text-xs"
            min={8}
            max={72}
          />
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setFontSizeValue(currentFontSize + 1)}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* Text Formatting */}
        <Button
          variant={editor.isActive('bold') ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0 font-bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Bold"
        >
          B
        </Button>
        <Button
          variant={editor.isActive('italic') ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0 italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Italic"
        >
          I
        </Button>
        <Button
          variant={editor.isActive('underline') ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

        {/* Text Color */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <div className="flex items-center">
                <span className="text-xs font-bold">A</span>
                <div 
                  className="w-3 h-0.5 ml-0.5" 
                  style={{ backgroundColor: currentColor }}
                />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <div className="grid grid-cols-10 gap-1 p-2">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                  className={cn(
                    "w-6 h-6 rounded border hover:ring-2 hover:ring-blue-500",
                    currentColor === color && "ring-2 ring-blue-500"
                  )}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* Insert Elements */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={addImage}
          title="Insert image"
        >
          <ImageIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => setShowLinkDialog(true)}
          title="Insert link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <div className="mx-1 h-6 w-px bg-gray-300" />

        {/* Alignment */}
        <Button
          variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          title="Align left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          title="Align center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          title="Align right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          title="Justify"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>

        {/* Lists */}
        <Button
          variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Bullet list"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Checklist">
          <CheckSquare className="h-4 w-4" />
        </Button>

        {/* Indentation */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().liftListItem('listItem').run()}
          disabled={!editor.can().liftListItem('listItem')}
          title="Decrease indent"
        >
          <div className="flex items-center">
            <div className="w-2 h-0.5 bg-current" />
            <ChevronLeft className="h-3 w-3" />
          </div>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().sinkListItem('listItem').run()}
          disabled={!editor.can().sinkListItem('listItem')}
          title="Increase indent"
        >
          <div className="flex items-center">
            <div className="w-2 h-0.5 bg-current" />
            <ChevronRight className="h-3 w-3 ml-0.5" />
          </div>
        </Button>

        {/* Mode */}
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 px-3">
                Editing <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Editing</DropdownMenuItem>
              <DropdownMenuItem>Suggesting</DropdownMenuItem>
              <DropdownMenuItem>Viewing</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="absolute z-50 bg-white border rounded-lg shadow-lg p-4 mt-2 ml-4">
          <Input
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                addLink();
              } else if (e.key === 'Escape') {
                setShowLinkDialog(false);
              }
            }}
            autoFocus
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={addLink}>Add</Button>
            <Button size="sm" variant="outline" onClick={() => setShowLinkDialog(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}



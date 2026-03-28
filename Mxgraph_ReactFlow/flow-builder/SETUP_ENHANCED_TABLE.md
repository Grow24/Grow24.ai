# Enhanced Table Node Setup Instructions

## 1. Update FlowBuilder.tsx

Replace these imports in `apps/frontend/src/pages/FlowBuilder.tsx`:

```typescript
// Change this line:
import { NodeConfigDrawer } from '../components/NodeConfigDrawer';

// To this:
import { NodeConfigDrawer } from '../components/NodeConfigDrawerEnhanced';
```

## 2. Update nodeTypes.ts

Replace the file `apps/frontend/src/config/nodeTypes.ts` with the content from `nodeTypesUpdated.ts`:

```bash
# In the frontend directory:
cp src/config/nodeTypesUpdated.ts src/config/nodeTypes.ts
```

## 3. Install Required Dependencies

```bash
# In the frontend directory:
npm install @radix-ui/react-context-menu
```

## 4. Import Table Styles

Add this import to `apps/frontend/src/pages/FlowBuilder.tsx`:

```typescript
import '../styles/tableNode.css';
```

## 5. Test the Enhanced Features

1. **Add Table Node**: Click Table icon in sidebar
2. **Edit Cells**: Double-click any cell to edit content
3. **Context Menu**: Right-click any cell → Add/Delete rows/columns
4. **Resize**: Hover over cell borders → drag to resize
5. **Configure**: Double-click table node → Enhanced config panel

## 6. Features Available

✅ **Context Menu**: Right-click cells for operations
✅ **Resizing**: Drag column/row borders  
✅ **Configuration Panel**: Table dimensions and styling
✅ **Real-time Updates**: All changes persist immediately
✅ **Professional Styling**: Draw.io-grade appearance

## Troubleshooting

If features don't work:
1. Check browser console for errors
2. Verify all imports are updated
3. Ensure dependencies are installed
4. Clear browser cache and reload

The enhanced table node provides Draw.io-level functionality with professional UX!
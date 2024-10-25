import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TFileListType } from '../UploadFile';
import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import SortableFileItem from './SortableFileItem';

interface ISortableFileItemProps {
  fileList: TFileListType[];
  onChange: (value: TFileListType[]) => void;
  onRemoveFile?: (id: string) => void;
}

const SortableFileList: React.FC<ISortableFileItemProps> = ({
  fileList,
  onChange,
  onRemoveFile,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Kích hoạt kéo sau khi di chuyển 5px
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = fileList.findIndex((item) => item.id === active.id);
      const newIndex = fileList.findIndex((item) => item.id === over.id);
      const newFileList = arrayMove(fileList, oldIndex, newIndex);
      onChange(newFileList);
    }
  };


  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={fileList} strategy={verticalListSortingStrategy}>
        <ul className="flex items-center gap-1">
          {fileList.map((file) => (
            <SortableFileItem key={file.id} id={file.id}>
              <div className="w-20 h-20 relative">
                <img
                  className="w-full h-full object-cover"
                  src={file.url}
                  alt="image"
                />
                <div className="absolute top-0 right-0">
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => onRemoveFile?.(file.id)}
                  />
                </div>
              </div>
            </SortableFileItem>
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
};

export default SortableFileList;

import React, { memo, useState, useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import style from './index.module.scss';
import { Drawer } from 'antd';
import { useOnResize, useKeydown } from '@/hooks';
import FlowGraph from '@/graph';
import { formatGroupInfoToNodeMeta } from '@/utils/formatGroupInfoToNodeMeta';
import { tempalteType } from '@/graphTemplateType';
import ConfigPanel from '@/core/ConfigPanel';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Menu, ContextMenu } from '@antv/x6-react-components';
import { Edge, Node } from '@antv/x6';
import { ScissorOutlined, CopyOutlined, SnippetsOutlined, DeleteOutlined } from '@ant-design/icons';
import '@antv/x6-react-components/es/dropdown/style/index.css';
import '@antv/x6-react-components/es/context-menu/style/index.css';
import '@/graph/registeredNode';
import '@/graph/reactRegisteredNode';
import 'antd/dist/antd.css';
import '@antv/x6-react-components/es/menu/style/index.css';
const closeStyle: React.CSSProperties = {
  right: '0px',
};

const DropTarget = memo(function DropTarget(props) {
  const [visible, setVisible] = useState<boolean>(true);
  const [coordinate, setCoordinate] = useState<{ x: number; y: number }>();
  const [isRender, setIsRender] = useState<boolean>(false);
  const [currentVal, setCurrentVal] = useState<Node | Edge | null>(null);
  const { width, height } = useOnResize();
  const onClose = () => setVisible(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const keyDown = useKeydown([isRender]);
  const [collectProps, droper] = useDrop({
    accept: 'Box',
    collect: (minoter) => ({
      isOver: minoter.isOver(),
      canDrop: minoter.canDrop(),
      item: minoter.getItem(),
    }),
    drop: (item: tempalteType, monitor) => {
      // 拖拽组件当前offset
      const currentMouseOffset = monitor.getClientOffset();
      // 拖拽组件初始拖拽时offset
      const sourceMouseOffset = monitor.getInitialClientOffset();
      const sourceElementOffset = monitor.getInitialSourceClientOffset();
      const diffX = sourceMouseOffset!.x - sourceElementOffset!.x;
      const diffY = sourceMouseOffset!.y - sourceElementOffset!.y;
      const x = currentMouseOffset!.x - diffX;
      const y = currentMouseOffset!.y - diffY;
      // 将实际的x,y这样的坐标转换画布本地坐标
      const point = FlowGraph.graph.clientToLocal(x, y);
      const createNodeData = formatGroupInfoToNodeMeta(item, point);
      FlowGraph.graph.addNode(createNodeData);
    },
  });
  const handleKeys = (val: number) => {
    const { graph } = FlowGraph;
    const { x, y } = coordinate!;
    if (!graph || !currentVal) {
      return false;
    }
    switch (val) {
      case 1:
        currentVal?.remove();
        setCurrentVal(null);
        break;
      case 2:
        graph.copy([currentVal!]);
        break;
      case 3:
        if ((currentVal! as any).getPosition) {
          const position = (currentVal! as any).getPosition();
          // dx：是计算的偏移量
          graph.paste({ offset: { dx: x - position.x, dy: y - position.y } });
        } else {
          graph.paste();
        }
        setCurrentVal(null);
        break;
      case 4:
        graph.cut([currentVal!]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const graph = FlowGraph.init();
    if (graph) {
      setIsRender(true);
      graph.on('node:contextmenu', ({ e, x, y, cell }) => {
        setCoordinate({ x, y });
        setCurrentVal(cell);
        console.log('44444', cell.getPosition(), e, x, y);
      });
      graph.on('edge:contextmenu', ({ e, x, y, edge }) => {
        setCoordinate({ x, y });
        setCurrentVal(edge);
      });
      graph.on('blank:contextmenu', ({ e, x, y }) => {
        setCoordinate({ x, y });
        console.log('blank', x, y);
      });
    }
  }, []);

  useEffect(() => {
    if (FlowGraph.isGraphReady()) {
      FlowGraph.graph.resize(width - 300, height);
    }
  }, [width, height]);

  return (
    <ContextMenu
      overlayStyle={{ overflow: 'hidden' }}
      onVisibleChange={(val) => {
        !val && setCurrentVal(null);
      }}
      menu={
        <Menu hasIcon={true}>
          <Menu.Item
            text="复制"
            key="2"
            onClick={() => handleKeys(2)}
            icon={<CopyOutlined />}
            disabled={!currentVal ? true : false}
            hotkey="Ctrl+C"
          ></Menu.Item>
          <Menu.Item
            text="粘贴"
            key="3"
            hotkey="Ctrl+V"
            onClick={() => handleKeys(3)}
            icon={<SnippetsOutlined />}
            disabled={!currentVal ? true : false}
          ></Menu.Item>
          <Menu.Item
            text="剪切"
            hotkey="Ctrl+X"
            key="4"
            onClick={() => handleKeys(4)}
            icon={<ScissorOutlined />}
            disabled={!currentVal ? true : false}
          ></Menu.Item>
          <Menu.Item
            text="删除"
            key="1"
            onClick={() => handleKeys(1)}
            icon={<DeleteOutlined />}
            disabled={!currentVal ? true : false}
          ></Menu.Item>
        </Menu>
      }
    >
      <div className={style.warp} id="drawWarp">
        <div
          ref={(ele) => {
            containerRef.current = ele;
            droper(ele);
          }}
          className={style.dropTarget}
          id="container"
        ></div>
        <Drawer placement="right" mask={false} onClose={onClose} visible={visible} width={260}>
          <div className={style.config}>{isRender && <ConfigPanel />}</div>
        </Drawer>
        <div
          className={style.close}
          style={!visible ? closeStyle : undefined}
          onClick={() => setVisible(true)}
        >
          <UnorderedListOutlined />
        </div>
      </div>
    </ContextMenu>
  );
});

export default DropTarget;

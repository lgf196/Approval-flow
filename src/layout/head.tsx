import React, { memo } from 'react';
import style from './index.module.scss';
import {
  DeleteOutlined,
  UndoOutlined,
  RedoOutlined,
  CopyOutlined,
  ScissorOutlined,
  SnippetsOutlined,
  InsertRowBelowOutlined,
  PrinterOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { Tooltip, Button, Popover } from 'antd';
import { DataUri } from '@antv/x6';
import FlowGraph from '@/graph';
export interface lineType<T = string> {
  sourceId: T;
  targetId: T;
  text?: T;
}
export interface nodeType<T = string> {
  id: T;
  type: T;
  text?: T;
}
const Head = memo(function Head(props) {
  const handleClick = (name: string) => {
    const { graph } = FlowGraph;
    switch (name) {
      case 'undo':
        graph.history.undo();
        break;
      case 'redo':
        graph.history.redo();
        break;
      case 'delete':
        graph.clearCells();
        break;
      case 'save':
        graph.toPNG(
          (datauri: string) => {
            DataUri.downloadDataUri(datauri, 'ant.png');
          },
          {
            padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            },
          },
        );
        break;
      case 'print':
        graph.printPreview();
        break;
      case 'copy':
        FlowGraph.copy();
        break;
      case 'cut':
        FlowGraph.cut();
        break;
      case 'paste':
        FlowGraph.paste();
        break;
      default:
        break;
    }
  };
  const content = () => (
    <>
      <p className="marB-10">
        <span style={{ display: 'inline-block', width: '150px' }}>
          <code>meta+z</code>
          <code>ctrl+z</code>
        </span>
        <span className="pd">撤销</span>
      </p>
      <p className="marB-10">
        <span style={{ display: 'inline-block', width: '150px' }}>
          <code>meta+shift+z</code>
          <code>ctrl+y</code>
        </span>
        <span className="pd">重做</span>
      </p>
      <p className="marB-10">
        <span style={{ display: 'inline-block', width: '150px' }}>
          <code>meta+s</code>
          <code>ctrl+s</code>
        </span>
        <span className="pd">导出保存</span>
      </p>
      <p className="marB-10">
        <span style={{ display: 'inline-block', width: '150px' }}>
          <code>meta+p</code>
          <code>ctrl+p</code>
        </span>
        <span className="pd">打印</span>
      </p>
      <p className="marB-10">
        <span style={{ display: 'inline-block', width: '150px' }}>
          <code>meta+c</code>
          <code>ctrl+c</code>
        </span>
        <span className="pd">复制</span>
      </p>
      <p className="marB-10">
        <span style={{ display: 'inline-block', width: '150px' }}>
          <code>meta+v</code>
          <code>ctrl+v</code>
        </span>
        <span className="pd">粘贴</span>
      </p>
      <p className="marB-10">
        <span style={{ display: 'inline-block', width: '150px' }}>
          <code>meta+x</code>
          <code>ctrl+x</code>
        </span>
        <span className="pd">剪切</span>
      </p>
    </>
  );

  const save = () => {
    const { graph } = FlowGraph;
    const cells = graph.toJSON();
    const line: lineType[] = [];
    const node: nodeType[] = [];
    if (cells.cells) {
      cells.cells.forEach((item) => {
        if (item.shape === 'edge') {
          const lineItem = Object.create(null);
          lineItem.sourceId = item.source.cell;
          lineItem.targetId = item.target.cell;
          if (item.labels && item.labels.length) {
            lineItem.text = item.labels[0].attrs.label.text;
          }
          line.push(lineItem);
        } else {
          const nodeItem = Object.create(null);
          nodeItem.id = item.id;
          nodeItem.type = item.data.type;
          if (item.attrs && item.attrs.text) {
            nodeItem.text = (item.attrs.text as any).textWrap.text;
          }
          node.push(nodeItem);
        }
      });
      console.log('first', line, node, cells);
    }
  };

  return (
    <div className={style.header}>
      <h1 className={style.title}>
        <a href="/">
          <img src="http://blog.lgf196.top/ant-simple-pro-document/logon.png" alt="" />
          <span>DRAW</span>
        </a>
      </h1>
      <div className={style.option}>
        <Button type="primary" ghost icon={<SaveOutlined />} onClick={() => save()}>
          保存
        </Button>
        {/* <Button
          type="primary"
          ghost
          icon={<DownloadOutlined />}
          onClick={() => handleClick('save')}
        >
          导出画布
        </Button> */}
        <Popover
          content={content}
          title={<p style={{ textAlign: 'center' }}>快捷键</p>}
          trigger="hover"
        >
          <InsertRowBelowOutlined className={style.icon} />
        </Popover>
        <Tooltip title="清屏">
          <DeleteOutlined className={style.icon} onClick={() => handleClick('delete')} />
        </Tooltip>
        <Tooltip title="撤销">
          <UndoOutlined className={style.icon} onClick={() => handleClick('undo')} />
        </Tooltip>
        <Tooltip title="重做">
          <RedoOutlined className={style.icon} onClick={() => handleClick('redo')} />
        </Tooltip>
        <Tooltip title="复制">
          <CopyOutlined className={style.icon} onClick={() => handleClick('copy')} />
        </Tooltip>
        <Tooltip title="剪切">
          <ScissorOutlined className={style.icon} onClick={() => handleClick('cut')} />
        </Tooltip>
        <Tooltip title="粘贴">
          <SnippetsOutlined className={style.icon} onClick={() => handleClick('paste')} />
        </Tooltip>
        <Tooltip title="打印">
          <PrinterOutlined className={style.icon} onClick={() => handleClick('print')} />
        </Tooltip>
      </div>
    </div>
  );
});

export default Head;

import { tempalteType } from '@/graphTemplateType';
import { shapeCategory } from '@/config';
const BasicTemplate: tempalteType[] = [
  { type: 'rectangle', title: '长方形', category: shapeCategory.base },
  { type: 'circle', title: '圆', category: shapeCategory.base },
  {
    type: 'roundedRectangle',
    title: '圆角矩形',
    category: shapeCategory.base,
  },
  { type: 'diamond', title: '菱形', category: shapeCategory.base },
  { type: 'quadrilateral', title: '四边形', category: shapeCategory.base },
  { type: 'ellipse', title: '椭圆', category: shapeCategory.base },
  // { type: 'noRulepath', title: 'noRulepath', category: shapeCategory.base },
  // { type: 'heart', title: 'heart', category: shapeCategory.base },
  // {
  //   type: 'fivePointedStar',
  //   title: 'fivePointedStar',
  //   category: shapeCategory.base,
  // },
  // { type: 'lightning', title: 'lightning', category: shapeCategory.base },
  // { type: 'forward', title: 'forward', category: shapeCategory.base },
  // {
  //   type: 'forwardDouble',
  //   title: 'forwardDouble',
  //   category: shapeCategory.base,
  // },
  // { type: 'panorama', title: 'panorama', category: shapeCategory.base },
  // { type: 'pause', title: 'pause', category: shapeCategory.base },
];

export default BasicTemplate;

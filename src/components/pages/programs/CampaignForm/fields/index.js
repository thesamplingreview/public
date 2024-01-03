import FieldText from './FieldText.jsx';
import FieldSelect from './FieldSelect.jsx';
import FieldSelectImage from './FieldSelectImage.jsx';
import FieldProduct from './FieldProduct.jsx';
import FieldYesNo from './FieldYesNo.jsx';
import FieldFile from './FieldFile.jsx';
import FieldAddress from './FieldAddress.jsx';
import FieldStatic from './FieldStatic.jsx';

const fields = {
  text: FieldText,
  select: FieldSelect,
  select_image: FieldSelectImage,
  products: FieldProduct,
  yes_no: FieldYesNo,
  file: FieldFile,
  address: FieldAddress,
  static: FieldStatic,
};

export default fields;

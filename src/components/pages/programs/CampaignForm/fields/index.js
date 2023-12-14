import FieldText from './FieldText.jsx';
import FieldSelect from './FieldSelect.jsx';
import FieldProduct from './FieldProduct.jsx';
import FieldYesNo from './FieldYesNo.jsx';
import FieldAddress from './FieldAddress.jsx';

const fields = {
  text: FieldText,
  select: FieldSelect,
  products: FieldProduct,
  true_false: FieldYesNo,
  address: FieldAddress,
};

export default fields;

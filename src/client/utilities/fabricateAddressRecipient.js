import {nullifyFieldUnlessValid} from './fieldNormalizers'


export const assembleAddressRecipient = ({name, address}) => {
  let recipient = '';
  if( typeof field === 'object' ) {
    recipient = (name.trim() + '\n' + address).trim();
  }
  return recipient;
}

export const disassembleAddressRecipient = (recipient) => {
  let name = '', address = '';
  if( nullifyFieldUnlessValid(recipient) ) {
    // handle edge case: recipient is a single line with no \n
    let normalized_recipient = recipient + '\n';
    const indexOfFirstLine = normalized_recipient.indexOf('\n');
    name    = normalized_recipient.slice(0, indexOfFirstLine);
    address = normalized_recipient.slice(indexOfFirstLine+1).trimEnd();
  }
  return {name, address};
}
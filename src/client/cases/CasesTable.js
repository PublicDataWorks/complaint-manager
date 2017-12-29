import React from 'react'
import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';

const CasesTable = (props) => {

  return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell data-test='casesNumberHeader'>Case #</TableCell>
            <TableCell data-test='casesStatusHeader'>Status</TableCell>
            <TableCell data-test='casesComplainantHeader'>Complainant</TableCell>
            <TableCell data-test='casesCreatedOnHeader'>Created On</TableCell>
          </TableRow>
        </TableHead>
        {
          (props.cases)
            ? <TableBody>{
              props.cases.map( entry =>
              <TableRow key={entry.id} data-test="casesTableEntry">
                 <TableCell>{entry.id}</TableCell>
                 <TableCell>{entry.status} </TableCell>
                 <TableCell>{`${entry.lastName}, ${entry.firstName[0]}.`}</TableCell>
                 <TableCell>{entry.createdOn}</TableCell>
              </TableRow>)}
            </TableBody>
            : null
        }
      </Table>)
}

export default CasesTable

// <TableBody>
// props.cases.map(entry => {
//   <TableRow key={entry.id} data-test="casesTableEntry">
//     <TableCell>{entry.id}</TableCell>
//     <TableCell>{entry.status} </TableCell>
//     <TableCell>{`${entry.lastName}, ${entry.firstName[0]}.`}</TableCell>
//     <TableCell>{entry.createdOn}</TableCell>
//   </TableRow>})
// </TableBody>




import {   useNavigate } from 'react-router-dom';


function Main({row, rowIndex}) {

    let navigate = useNavigate(); 

    const handleClick = (uuid) => {
        navigate(`/dashboard/invoice/${uuid}`);
      };

    return (
        
        <tr
             
            className={rowIndex % 2 === 0 ? 'bg-gray-100' : ''}
        >
            {row && <>
            <td className="px-4 py-2 border">
               <a
                   onClick={() => handleClick(row.invoiceUUID)}
                   style={{ cursor: 'pointer' }}
                >
               {row.invoiceUUID}
               </a>

            </td>
             <td className="px-4 py-2 border">
                 {row.description}
              </td>
              </>
            }
        </tr>
        
    )
    
    
    }
    
    
    export default Main;
    
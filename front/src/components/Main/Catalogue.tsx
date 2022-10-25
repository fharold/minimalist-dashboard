import React from "react";
import Box from "components/Shared/Box";
import {pxToRem} from "utils/HtmlClassUtils";

const Catalogue: React.FC = () => {
  return (
    <Box width={pxToRem(1060)} height={'100%'} overflow={'auto'} backgroundColor={'lightcyan'} className={'flex-row'}>
      <div className="flex flex-wrap flex-center">
        {[...Array(9)].map((x, i) => // TODO REMOVE DEBUG
          <Box key={i} width={pxToRem(240)} height={pxToRem(237)} overflow={'hidden'} backgroundColor={'cyan'}
               margin={pxToRem(16)} className={'flex flex-center'}>
            {i}
          </Box>
        )}
      </div>
    </Box>
  );
}

export default Catalogue;
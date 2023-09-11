import React from 'react'
import SmilesView from '../../../../../app/common/SmilesView/SmilesView'


const HAOverviewActiveHA = () => {
    return (
        <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
            <div className="flex  p-4 justify-content-center hover:shadow-3">

                <div className="flex pb-1">
                    <SmilesView
                        smiles="O=S(C1=CN=C(C2=CC=CC=C2)S1)(NC3=NC=C(Cl)C=C3Cl)=O"
                        width={"150"}
                        height={"150"}

                    />
                </div>
                <div className="flex flex-column p-4 justify-content-center hover:shadow-3 ">
                    <div className="flex pb-1 ">
                        <div
                            className="flex p-1 justify-content-center bg-orange-200 text-orange-800 text-xs border-right-1 border-orange-100"
                            style={{

                            }}
                        >
                            A-2087484.0

                        </div>
                    </div>
                    <div className="flex pb-1 ">
                    </div>
                    <div
                        className="flex justify-content-center cursor-pointer"
                        style={{
                            fontSize: "small",
                        }}

                    >
                        <div
                            className="flex p-2 bg-orange-50  text-orange-600 justify-content-center"
                            style={{
                                minWidth: "7rem"
                            }}
                        >
                            Malate Synthase - Sulfonamides
                        </div>
                    </div>
                </div>







            </div>

        </div>
    )
}

export default HAOverviewActiveHA
import React from 'react'
import SmilesView from '../../../../../app/common/SmilesView/SmilesView'

const HAOverviewInActiveHA = () => {
    return (
        <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
            <div className="flex p-4 justify-content-center hover:shadow-3 ">
                <div className="flex pb-1">
                    <SmilesView
                        smiles="O=S(C1=CN=C(C2=CC=CC=C2)S1)(NC3=NC=C(Cl)C=C3Cl)=O"
                        width={"150"}
                        height={"150"}

                    />
                </div>
                <div className="flex flex-column p-4 justify-content-center hover:shadow-3 ">
                    <div className="flex flex-row pb-1 ">


                        <div
                            className="flex p-1 mr-3 justify-content-center bg-orange-200 text-orange-800  text-xs"
                            style={{
                                minWidth: "4rem",
                            }}
                        >
                            SACC-00356961
                        </div>
                        <div
                            className="flex p-1 align-items-end justify-content-center bg-green-200 text-green-800  text-xs"
                            style={{
                                minWidth: "4rem",
                            }}
                        >
                            Incorrect m/z

                        </div>

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
                                minWidth: "10rem"
                            }}
                        >
                            NadD-1 Screen Followup Cluster Group 10 (Neem series)
                        </div>
                    </div>

                </div>



            </div>

        </div>
    )
}

export default HAOverviewInActiveHA
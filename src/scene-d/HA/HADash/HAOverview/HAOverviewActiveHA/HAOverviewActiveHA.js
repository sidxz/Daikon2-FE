import React from 'react'

const HAOverviewActiveHA = () => {
    return (
        <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
            <div className="flex flex-column p-4 justify-content-center hover:shadow-3 ">
                <div className="flex pb-1 ">
                    <div
                        className="flex p-1 justify-content-center bg-orange-200 text-orange-800 text-xs border-right-1 border-orange-100"
                        style={{
                            minWidth: "10rem",
                        }}
                    >
                        A-2087484.0

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
                            minWidth: "7rem"
                        }}
                    >
                        Malate Synthase - Sulfonamides
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HAOverviewActiveHA
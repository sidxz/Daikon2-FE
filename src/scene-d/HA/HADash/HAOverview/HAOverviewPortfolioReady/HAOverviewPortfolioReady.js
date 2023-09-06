import React from 'react'

const HAOverviewPortfolioReady = () => {
    return (
        <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
            <div className="flex flex-column p-2 bg-yellow-50 justify-content-center shadow-1 hover:shadow-3">

                <div
                    className="flex align-items-end justify-content-end justify-content-center cursor-pointer"
                    style={{
                        fontSize: "small",
                    }}

                >


                    <div
                        className="flex  p-2 text-yellow-700 justify-content-center"
                        style={{
                            minWidth: "7rem"
                        }}
                    >
                        HAA (RNA Pol - AAP1 2)

                    </div>



                </div>



            </div>
            <div className="flex flex-column p-2 bg-yellow-50 justify-content-center shadow-1 hover:shadow-3">

                <div
                    className="flex align-items-end justify-content-end justify-content-center cursor-pointer"
                    style={{
                        fontSize: "small",
                    }}

                >


                    <div
                        className="flex  p-2 text-yellow-700 justify-content-center"
                        style={{
                            minWidth: "7rem"
                        }}
                    >
                        Pyrazolo Triazinone (PTO)


                    </div>



                </div>



            </div>

        </div>
    )
}

export default HAOverviewPortfolioReady
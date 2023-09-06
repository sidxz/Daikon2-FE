import React from 'react'

const HAOverviewInActiveHA = () => {
    return (
        <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
            <div className="flex flex-column p-3 justify-content-center hover:shadow-3">
                <div className="flex flex-row pb-1 ">


                    <div
                        className="flex p-1 mr-8 justify-content-center bg-orange-200 text-orange-800  text-xs"
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
                            minWidth: "7rem"
                        }}
                    >
                        NadD-1 Screen Followup Cluster Group 10 (Neem series)
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HAOverviewInActiveHA
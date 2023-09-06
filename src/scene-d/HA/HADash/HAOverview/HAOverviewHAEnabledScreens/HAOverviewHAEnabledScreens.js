import React from 'react'

const HAOverviewHAEnabledScreens = () => {
    return (
        <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
            <div className="flex flex-column p-4  text-green-700 justify-content-center hover:shadow-3">
                <div className="flex align-items-end justify-content-end">
                    <div
                        className="flex p-1 justify-content-center bg-white text-700 text-xs border-right-1 border-green-100"
                        style={{
                            minWidth: "4rem",
                        }}
                    >
                        Biochemical
                    </div>

                    <div
                        className="flex p-1 justify-content-center bg-white text-700 text-xs"
                        style={{
                            minWidth: "4rem",
                        }}
                    >
                        TAMU
                    </div>
                </div>
                <div
                    className="flex justify-content-center cursor-pointer"
                    style={{
                        fontSize: "small",
                    }}

                >
                    <div
                        className="flex p-2 bg-green-50  justify-content-center text-green-700 "
                        style={{
                            minWidth: "9rem"
                        }}
                    >
                        NadD-1
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HAOverviewHAEnabledScreens
import React from 'react'

const HAOverviewActiveHA = () => {
    return (
        <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
            <div className="flex flex-column bg-purple-50 justify-content-center shadow-1 hover:shadow-3">
                <div className="flex align-items-end justify-content-end">
                    <div
                        className="flex p-1 justify-content-center bg-white text-700 text-xs border-right-1 border-purple-100"
                        style={{
                            minWidth: "5rem",
                        }}
                    >
                        Compound ID
                    </div>

                    <div
                        className="flex p-1 justify-content-center bg-white text-700 text-xs"
                        style={{
                            minWidth: "5rem",
                        }}
                    >
                        Structure
                    </div>
                </div>
                <div
                    className="flex justify-content-center cursor-pointer"
                    style={{
                        fontSize: "large",
                    }}

                >
                    <div
                        className="flex p-2 justify-content-center"
                        style={{
                            minWidth: "7rem",
                            color: "#5D3891",
                        }}
                    >
                        HA Project Name
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HAOverviewActiveHA
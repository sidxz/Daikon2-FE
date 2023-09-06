import React from 'react'

const HAOverviewPortfolioReady = () => {
    return (
        <div className="flex flex-wrap w-full gap-3 p-1 align-items-center justify-content-center">
            <div className="flex flex-column bg-purple-50 justify-content-center shadow-1 hover:shadow-3">

                <div
                    className="flex align-items-end justify-content-end justify-content-center cursor-pointer"
                    style={{
                        fontSize: "large",
                    }}

                >
                    <div
                        className="flex p-3 justify-content-center"
                        style={{
                            minWidth: "7rem",
                            color: "#5D3891",
                        }}
                    >
                        Portfolio Project name
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HAOverviewPortfolioReady
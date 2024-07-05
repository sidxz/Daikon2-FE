import React from "react";
import "./FTVApconixGrid.css";
import { FcPlanner } from "react-icons/fc";

const FTVApconixGrid = () => {
  return (
    <div className="flex">
      <div className="flex">
        <div className="flex flex-column">
          <div className="flex w-1 p-2 align-items-center bg-white">&nbsp;</div>
          <div className="flex">
            <div className="flex w-full p-2 align-items-center justify-content-center bg-teal-400 text-white">
              Carcinogenesis
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2 align-items-center justify-content-center bg-teal-400 text-white">
              Cardiovascular
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2 align-items-center justify-content-center bg-teal-400 text-white">
              Endocrine
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Gastrointestinal
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Hematological and Immune
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Hepatobiliary
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Integumentary
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Nervous
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Embryofetal Developmental Toxicity
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Reproductive Female
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Reproductive Male
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Respiratory
            </div>
          </div>
          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Sensory
            </div>
          </div>

          <div className="flex w-full pt-2">
            <div className="flex w-full p-2  align-items-center justify-content-center bg-teal-400 text-white">
              Urinary
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full surface-0">
        <div className="flex w-1 p-4 align-items-center bg-white">&nbsp;</div>
        <div className="flex w-3 text-sm">
          <div
            className="flex text-lg"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <b>Risk</b>
            </div>
          </div>
        </div>
        <div className="flex w-3 text-sm ">
          <div
            className="flex text-lg"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <b>Impact</b>
            </div>
          </div>
        </div>
        <div className="flex w-3 text-sm">
          <div
            className="flex text-lg"
            style={{
              color: "#3c83bd",
            }}
          >
            <div className="flex">
              <b>Likelihood </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FTVApconixGrid;

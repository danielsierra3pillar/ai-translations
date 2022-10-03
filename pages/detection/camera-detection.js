// Import dependencies
import React, { useRef, useState, useEffect } from "react"
// import * as tf from "@tensorflow/tfjs"
// import * as cocossd from "@tensorflow-models/coco-ssd"
import "@tensorflow/tfjs-backend-webgl"
import "@tensorflow/tfjs-backend-cpu"
import Webcam from "react-webcam"
import { drawRect } from "./utilities"
import { NavBar } from "../home/home-page"
import { ALPHABET } from "./alphabet"
import { Spinner } from "@chakra-ui/react"

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

import { Stat, StatNumber, SimpleGrid, Box, Text } from "@chakra-ui/react"

const cocossd = require("@tensorflow-models/coco-ssd")

export default function CameraDetection() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const [detection, setDetection] = useState([])
  const [isModelLoading, setIsModelLoading] = useState(false)

  // Main function
  const runCoco = async () => {
    const net = await cocossd.load()

    if (net) {
      setIsModelLoading(false)
    }
    console.log("Handpose model loaded.")
    //  Loop and detect hands
    setInterval(() => {
      detect(net)
    }, 10)
  }

  const detect = async net => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video
      const videoWidth = webcamRef.current.video.videoWidth
      const videoHeight = webcamRef.current.video.videoHeight

      // Set video width
      webcamRef.current.video.width = videoWidth
      webcamRef.current.video.height = videoHeight

      // Set canvas height and width
      canvasRef.current.width = videoWidth
      canvasRef.current.height = videoHeight

      // Make Detections
      const obj = await net.detect(video)

      console.log("obj ---->", obj)

      setDetection(obj)

      // Draw mesh
      const ctx = canvasRef.current.getContext("2d")
      drawRect(obj, ctx)
    }
  }

  useEffect(() => {
    runCoco()
  }, [])

  if (isModelLoading) {
    return (
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
        className="loader"
      />
    )
  }

  return (
    <>
      {NavBar()}
      <div className="mainContent">
        <div className="camera-container">
          <Webcam
            ref={webcamRef}
            muted={true}
            style={{
              position: "absolute",
              marginLeft: "2%",
              marginRight: "auto",
              // left: 0,
              // right: 0,
              textAlign: "center",
              zindex: 9,
              width: 800,
              height: 640,
            }}
          />

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "2%",
              marginRight: "auto",
              // left: 0,
              // right: 0,
              textAlign: "center",
              zindex: 8,
              width: 800,
              height: 640,
            }}
          />
        </div>
        <div className="camera-results">

          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Ingles</Th>
                  <Th>Español</Th>
                  <Th>K'iche'</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  {detection.map(item => {
                    const filtered = ALPHABET.find(
                      alpha_item => alpha_item.english === item.class
                    )

                    if (filtered) {
                      return (
                        <>
                          <Td> {filtered.english} </Td>
                          <Td> {filtered.spanish} </Td>
                          <Td> {filtered.native} </Td>
                        </>
                      )
                    } else {
                      <>
                        <Td> Not found </Td>
                        <Td> No encontrada </Td>
                        <Td>  </Td>
                      </>
                    }
                  })}
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          
        </div>
      </div>
    </>
  )
}

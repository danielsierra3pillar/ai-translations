import React, { useRef, useState, useEffect } from "react"
import * as tf from "@tensorflow/tfjs"
import * as handpose from "@tensorflow-models/handpose"
import Webcam from "react-webcam"
import { drawHand } from "../../components/handposeutil"
import * as fp from "fingerpose"
import Handsigns from "../../components/handsigns"
import { ALPHABET } from "./alphabet"
import {
  Text,
  Heading,
  Button,
  Image,
  Stack,
  Container,
  Box,
  VStack,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  SimpleGrid,
} from "@chakra-ui/react"

import { Signimage, Signpass } from "../../components/handimage"

import About from "../../components/about"
import Metatags from "../../components/metatags"
import { NavBar } from "../home/home-page"

// import "../styles/App.css"

// import "@tensorflow/tfjs-backend-webgl"

import { RiCameraFill, RiCameraOffFill } from "react-icons/ri"

export default function HandDetection() {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const [camState, setCamState] = useState("on")

  const [, updateState] = useState()
  const forceUpdate = React.useCallback(() => updateState({}), [])

  const [sign, setSign] = useState(null)
  const [ready, setReady] = useState(false)
  // const [reachAcceptanceCryteria, setReachAcceptanceCryteria] = useState(0)
  const [displayWord, setDisplayWord] = useState("")
  const [result, setResult] = useState({})
  const [readyToUse, setReadyToUse] = useState(false)
  const ref = useRef(0)

  const [counter, setCounter] = useState(0)

  let signList = []
  let currentSign = 0

  let gamestate = "started"

  useEffect(() => {
    if (displayWord.length != 0) {
      console.log("displayWord", displayWord)
      const filtered = ALPHABET.find(
        alpha_item =>
          alpha_item.english.toUpperCase() === displayWord.toUpperCase() ||
          alpha_item.spanish.toUpperCase() === displayWord.toUpperCase()
      )
      console.log("filtered 1 --->", filtered)
      if (filtered) {
        console.log("filtered 2 --->", filtered)
        setResult(filtered)
      }
      // setReadyToUse(true)
    }
  }, [displayWord])


  async function runHandpose() {
    const net = await handpose.load()
    _signList()

    setInterval(() => {
      detect(net)
      setCounter(prevCounter => prevCounter + 1)
    }, 150)
  }

  useEffect(() => { })

  function _signList() {
    signList = generateSigns()
  }

  useEffect(() => {
    if (counter === 50) {
      console.log("sign --->", sign)
      console.log("counter reset -->", counter)
      const word = displayWord + sign
      setDisplayWord(word)
      setCounter(0)
    }
  }, [counter])

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
    }
    return a
  }

  function generateSigns() {
    const password = shuffle(Signpass)
    return password
  }

  async function detect(net) {
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
      const hand = await net.estimateHands(video)

      if (hand.length > 0) {
        //loading the fingerpose model
        const GE = new fp.GestureEstimator([
          fp.Gestures.ThumbsUpGesture,
          Handsigns.aSign,
          Handsigns.bSign,
          Handsigns.cSign,
          Handsigns.dSign,
          Handsigns.eSign,
          Handsigns.fSign,
          Handsigns.gSign,
          Handsigns.hSign,
          Handsigns.iSign,
          Handsigns.jSign,
          Handsigns.kSign,
          Handsigns.lSign,
          Handsigns.mSign,
          Handsigns.nSign,
          Handsigns.oSign,
          Handsigns.pSign,
          Handsigns.qSign,
          Handsigns.rSign,
          Handsigns.sSign,
          Handsigns.tSign,
          Handsigns.uSign,
          Handsigns.vSign,
          Handsigns.wSign,
          Handsigns.xSign,
          Handsigns.ySign,
          Handsigns.zSign,
        ])

        const estimatedGestures = await GE.estimate(hand[0].landmarks, 6.5)

        if (
          estimatedGestures.gestures !== undefined &&
          estimatedGestures.gestures.length > 0
        ) {
          const confidence = estimatedGestures.gestures.map(p => p.confidence)
          const maxConfidence = confidence.indexOf(
            Math.max.apply(undefined, confidence)
          )

          if (
            gamestate === "started"
          ) {
            _signList()
            gamestate = "played"
          } else if (gamestate === "played") {
            document.querySelector("#app-title").innerText = ""

            //looping the sign list
            if (currentSign === signList.length) {
              console.log("im in????")
              _signList()
              currentSign = 0
              return
            }

            if (
              typeof signList[currentSign].src.src === "string" ||
              signList[currentSign].src.src instanceof String
            ) {
              if (
                signList[currentSign].alt ===
                estimatedGestures.gestures[maxConfidence].name
              ) {
                currentSign++
              }
              setSign(estimatedGestures.gestures[maxConfidence].name)
            }
          } else if (gamestate === "finished") {
            return
          }
        }
      }
      // Draw hand lines
      const ctx = canvasRef.current.getContext("2d")
      drawHand(hand, ctx)
    }
  }

  useEffect(() => {
    runHandpose()
  }, [])


  const reset = () => {
    setCounter(0)
    setDisplayWord('')
  }

  return (
    <>
      {NavBar()}
      <Metatags />
      <Box>
        <Container centerContent maxW="xl" height="100vh" pt="0" pb="0">
          <VStack spacing={4} align="center">
            <Box h="20px"></Box>
            <Heading
              as="h3"
              size="md"
              className="tutor-text"
              color="white"
              textAlign="center"
            ></Heading>
            <Box h="20px"></Box>
          </VStack>

          <Heading
            as="h1"
            size="lg"
            id="app-title"
            color="white"
            textAlign="center"
          ></Heading>

          <Box id="webcam-container">
            {camState === "on" ? (
              <Webcam
                id="webcam"
                ref={webcamRef}
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  left: 0,
                  textAlign: "center",
                  zindex: 9,
                  width: 800,
                  height: 640,
                  top: "10%",
                }}
              />
            ) : (
              <div id="webcam" background="black"></div>
            )}

            {sign ? (
              <div
                style={{
                  position: "absolute",
                  marginLeft: "auto",
                  marginRight: "auto",
                  right: "calc(10% - 50px)",
                  bottom: 100,
                }}
              >

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
                        <Td> {result?.english} </Td>
                        <Td> {result?.spanish} </Td>
                        <Td> {result?.native} </Td>

                      </Tr>
                    </Tbody>

                    <Tfoot>
                      <Tr>
                        <Th>Display Word {displayWord} </Th>
                      </Tr>

                      <Tr>
                        <Th>Contador {counter} </Th>
                      </Tr>

                      <Tr>
                        <Th>Letra detectada
                          <br />
                          <img
                            alt="signImage"
                            src={
                              Signimage[sign]?.src
                                ? Signimage[sign].src
                                : "/loveyou_emoji.svg"
                            }
                            style={{
                              height: 30,
                              marginLeft: "auto",
                              marginRight: "auto",
                              right: "calc(10% - 50px)",
                              bottom: 100,
                            }}
                          />
                        </Th>
                      </Tr>


                      <Tr>
                        <Button style={{
                          marginLeft: "25px",
                        }} onClick={reset} colorScheme="orange">
                          Reset
                        </Button>
                      </Tr>




                    </Tfoot>

                  </Table>
                </TableContainer>


              </div>
            ) : (
              " "
            )}
          </Box>

          <canvas
            id="gesture-canvas"
            ref={canvasRef}
            style={{
              position: "absolute",
              marginLeft: "auto",
              marginRight: "auto",
              left: 0,
              textAlign: "center",
              zindex: 9,
              width: 800,
              height: 640,
              top: "10%",
            }}
          />

          <Box
            id="singmoji"
            style={{
              zIndex: 9,
              position: "fixed",
              top: "50px",
              right: "30px",
            }}
          ></Box>

          {/* <Image h="150px" objectFit="cover" id="emojimage" /> */}
          {/* <pre
            className="pose-data"
            color="white"
            style={{ position: "fixed", top: "150px", left: "10px" }}
          >
            Pose data
          </pre> */}
        </Container>

        <Stack id="start-button" spacing={4} direction="row" align="center">
          {/* <Button
            leftIcon={
              camState === "on" ? (
                <RiCameraFill size={20} />
              ) : (
                <RiCameraOffFill size={20} />
              )
            }
            onClick={turnOffCamera}
            colorScheme="orange"
          >
            Camera
          </Button> */}
        </Stack>
      </Box>
    </>
  )
}

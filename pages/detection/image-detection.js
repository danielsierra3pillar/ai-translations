import { useState, useEffect, useRef } from "react"
// import * as mobilenet from "@tensorflow-models/mobilenet"
import { SimpleGrid, Box, Text } from "@chakra-ui/react"
import { Button, Input } from "@chakra-ui/react"
import { NavBar } from "../home/home-page"
import { Spinner } from "@chakra-ui/react"
import { Select } from "@chakra-ui/react"
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
} from "@chakra-ui/react"

import "@tensorflow/tfjs-backend-webgl"
import "@tensorflow/tfjs-backend-cpu"
import axios from "axios"

const mobilenet = require("@tensorflow-models/mobilenet")
const cocossd = require("@tensorflow-models/coco-ssd")

export default function ImageDetection() {
  const [model, setModel] = useState(null)
  const [modelCoco, setModelCoco] = useState(null)
  const [imageURL, setImageURL] = useState(null)
  const [results, setResults] = useState([])
  const [resultsCoco, setResultsCoco] = useState([])
  const [history, setHistory] = useState([])
  const [alphabet, setAlphabet] = useState([])
  const [ready, isReady] = useState(false)

  const [isModelLoading, setIsModelLoading] = useState(false)

  const imageRef = useRef()
  const textInputRef = useRef()
  const fileInputRef = useRef()

  const [selectedNativeLanguage, setSelectedNativeLanguage] = useState("quiche")
  const [list, setList] = useState([])
  const [alphabetVirgin, setAlphabetVirgin] = useState([])

  const loadModel = async () => {
    setIsModelLoading(true)
    try {
      const model = await mobilenet.load()
      const net = await cocossd.load()

      if (model && net) {
        setIsModelLoading(false)
      }

      setModel(model)
      setModelCoco(net)
      setIsModelLoading(false)
    } catch (error) {
      console.log(error)
      setIsModelLoading(false)
    }
  }

  useEffect(() => {
    isReady(false)
    try {
      const getData = async () => {
        // agregar un param?
        const response = await axios.get("http://localhost:3001/translations")
        const responseList = await axios.get(
          "http://localhost:3001/translations/language"
        )

        if (response.data && responseList.data) {
          setList(responseList.data)
          setAlphabet(response.data)
          setAlphabetVirgin(response.data)
        }
      }
      if (!ready) {
        getData()
      }
    } catch (error) {
      console.log("error", error)
    }
  }, [])

  useEffect(() => {
    if (selectedNativeLanguage.length) {
      const filtered = alphabetVirgin.filter(
        item => item.lenguage === selectedNativeLanguage
      )
      console.log("what", {
        filtered,
        selectedNativeLanguage,
        alphabet,
      })
      setAlphabet(filtered)
    }
  }, [selectedNativeLanguage])

  const uploadImage = e => {
    const { files } = e.target
    if (files.length > 0) {
      const url = URL.createObjectURL(files[0])
      setImageURL(url)
    } else {
      setImageURL(null)
    }
  }

  const identify = async () => {
    textInputRef.current.value = ""
    const results = await model.classify(imageRef.current)
    const resultsCoco = await modelCoco.detect(imageRef.current)
    console.log("results", results)
    console.log("resultsCoco", resultsCoco)
    setResults(results)
    setResultsCoco(resultsCoco)
  }

  const handleOnChange = e => {
    setImageURL(e.target.value)
    setResults([])
  }

  const triggerUpload = () => {
    fileInputRef.current.click()
  }

  useEffect(() => {
    loadModel()
  }, [])

  useEffect(() => {
    if (imageURL) {
      setHistory([imageURL, ...history])
    }
  }, [imageURL])

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

  const selectedItemJSX = () => {
    if (list.length > 0) {
      console.log("list", list)
      return (
        <div>
          <Select
            placeholder="Select option"
            onChange={event => {
              console.log("local?", event.target.value)
              setSelectedNativeLanguage(event.target.value)
            }}
          >
            {list.map(item => {
              return <option value={item.lenguage}>{item.lenguage}</option>
            })}
          </Select>
        </div>
      )
    }
  }

  return (
    <>
      {NavBar()}
      <div>
        <div className="inputHolder">
          <input
            type="file"
            accept="image/*"
            capture="camera"
            className="uploadInput"
            onChange={uploadImage}
            ref={fileInputRef}
          />

          <Button onClick={triggerUpload} colorScheme="orange">
            Sube una imagen
          </Button>

          <span className="or">O</span>
          <Input
            placeholder="Pega un link de cualquier imagen"
            ref={textInputRef}
            onChange={handleOnChange}
          ></Input>
        </div>
        <div className="mainWrapper">
          <div className="mainContent">
            <div className="imageHolder">
              {imageURL && (
                <img
                  src={imageURL}
                  alt="Upload Preview"
                  crossOrigin="anonymous"
                  ref={imageRef}
                />
              )}
            </div>
            {selectedItemJSX()}
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Ingles</Th>
                    <Th>Español</Th>
                    <Th>K'iche'</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {resultsCoco.map(item => {
                    const filtered = alphabet?.find(
                      alpha_item => alpha_item.english === item.class
                    )

                    if (filtered) {
                      return (
                        <Tr>
                          <Td> {filtered.english} </Td>
                          <Td> {filtered.spanish} </Td>
                          <Td> {filtered.native} </Td>
                        </Tr>
                      )
                    } else {
                      ;<Tr>
                        <Td> Not found </Td>
                        <Td> No encontrada </Td>
                        <Td> </Td>
                      </Tr>
                    }
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
          {imageURL && (
            <Button onClick={identify} colorScheme="orange">
              Identificar Imagen
            </Button>
          )}
        </div>
      </div>
    </>
  )
}

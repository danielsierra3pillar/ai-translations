import React, { useEffect, useState } from "react"
import { useSpeechRecognition } from "react-speech-kit"
import { NavBar } from "../home/home-page"
import { Button } from "@chakra-ui/react"
import { ALPHABET } from "./alphabet"
import { SimpleGrid, Box, Text } from "@chakra-ui/react"
import { Spinner } from "@chakra-ui/react"
import axios from "axios"

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
import { Select } from "@chakra-ui/react"

export default function VoiceDetection() {
  const [value, setValue] = useState("")
  const [translation, setTranslation] = useState({})
  const [isModelLoading, setIsModelLoading] = useState(false)
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: result => {
      setValue(result)
    },
  })

  const [alphabet, setAlphabet] = useState([])
  const [ready, isReady] = useState(false)

  const [selectedNativeLanguage, setSelectedNativeLanguage] = useState("quiche")
  const [list, setList] = useState([])
  const [alphabetVirgin, setAlphabetVirgin] = useState([])

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

  useEffect(() => {
    setIsModelLoading(true)
    const timer = setTimeout(() => {
      console.log("Timeout called!")
      setIsModelLoading(false)
    }, 10000)
    console.log(value)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (value.length) {
      const filtered = alphabet.find(
        alpha_item =>
          alpha_item.english.toUpperCase() === value.toUpperCase() ||
          alpha_item.spanish.toUpperCase() === value.toUpperCase()
      )
      console.log("filtered", filtered)
      if (filtered) {
        setTranslation(filtered)
      }
    }
  }, [value])

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
        <input value={value} onChange={event => setValue(event.target.value)} />
        <Button onMouseDown={listen} onMouseUp={stop} colorScheme="orange">
          Presiona para hablar
        </Button>

        {listening && <div>Listo para escuchar</div>}
      </div>
      {selectedItemJSX()}
      {
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
              <Tr>
                <Td> {translation.english} </Td>
                <Td> {translation.spanish} </Td>
                <Td> {translation.native} </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      }
    </>
  )
}

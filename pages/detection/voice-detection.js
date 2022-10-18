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
} from '@chakra-ui/react'
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


  useEffect(() => {
    isReady(false)
    try {
      const getData = async () => {
        const response = await axios.get("http://localhost:3001/translations")
        if (response.data) {
          console.log('response', response)
          setAlphabet(response.data)
          isReady(true)
        }
      }
      if (!ready) {
        getData()
      }
    }
    catch (error) {
      console.log('error', error)
    }
  }, [])

  useEffect(() => {
    setIsModelLoading(true)
    const timer = setTimeout(() => {
      console.log('Timeout called!');
      setIsModelLoading(false)
    }, 10000);
    console.log(value)
    return () => clearTimeout(timer);
  }, []);

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

      {


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

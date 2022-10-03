import React, { useEffect, useState } from "react"
import { useSpeechRecognition } from "react-speech-kit"
import { NavBar } from "../home/home-page"
import { Button } from "@chakra-ui/react"
import { ALPHABET } from "./alphabet"
import { SimpleGrid, Box, Text } from "@chakra-ui/react"
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
export default function VoiceDetection() {
  const [value, setValue] = useState("")
  const [translation, setTranslation] = useState({})
  const [isModelLoading, setIsModelLoading] = useState(false)
  const { listen, listening, stop } = useSpeechRecognition({
    onResult: result => {
      setValue(result)
    },
  })

  useEffect(() => {
    setTimeout(() => {
      setIsModelLoading(false)
    }, 5000)
  }, [])

  useEffect(() => {
    const filtered = ALPHABET.find(
      alpha_item =>
        alpha_item.english.toUpperCase() === value.toUpperCase() ||
        alpha_item.spanish.toUpperCase() === value.toUpperCase()
    )

    console.log("filtered", filtered)
    if (filtered) {
      setTranslation(filtered)
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

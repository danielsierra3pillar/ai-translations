import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Heading,
  Text,
  Container,
} from "@chakra-ui/react"

const Links = [
  "Inicio",
  "Camara",
  "Imagenes",
  "Sign Lenguage",
  "Voice detection",
]

const NavLink = ({ children }) => {
  if (children === "Camara") {
    return (
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={"/detection/camera-detection"}
      >
        {children}
      </Link>
    )
  }

  if (children === "Imagenes") {
    return (
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={"/detection/image-detection"}
      >
        {children}
      </Link>
    )
  }

  if (children === "Sign Lenguage") {
    return (
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={"/detection/hand-detection"}
      >
        {children}
      </Link>
    )
  }

  if (children === "Voice detection") {
    return (
      <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
          textDecoration: "none",
          bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={"/detection/voice-detection"}
      >
        {children}
      </Link>
    )
  }

  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: useColorModeValue("gray.200", "gray.700"),
      }}
      href={"/"}
    >
      {children}
    </Link>
  )
}

export default function Simple() {
  return (
    <>
      {NavBar()}
      <Box p={4}>
        <Box bg={useColorModeValue("gray.100", "gray.700")}>
          <Container maxW={"7xl"} py={16} as={Stack} spacing={12}>
            <Stack spacing={0} align={"center"}>
              <Heading>Traductor Interactivo</Heading>
              <Text>
                Aprende K'iche' de una manera distinta e inclusiva para todas
                las personas!!
              </Text>
            </Stack>
            <Stack
              direction={{ base: "column", md: "row" }}
              spacing={{ base: 10, md: 4, lg: 10 }}
            >
              <Testimonial>
                <TestimonialContent>
                  <TestimonialHeading>Imagenes</TestimonialHeading>
                  <TestimonialText>
                    Traduce imagenes a texto en ingles, español y k'iche'
                  </TestimonialText>
                </TestimonialContent>
                <TestimonialAvatar
                  src={
                    "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  }
                  name={"Imagenes"}
                />
              </Testimonial>
              <Testimonial>
                <TestimonialContent>
                  <TestimonialHeading>Camara</TestimonialHeading>
                  <TestimonialText>
                    Desde la camara de tu computadora traduce a tiempo real
                    objetos a texto en ingles, español y k'iche'
                  </TestimonialText>
                </TestimonialContent>
                <TestimonialAvatar
                  src={
                    "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  }
                  name={"Camara"}
                />
              </Testimonial>
              <Testimonial>
                <TestimonialContent>
                  <TestimonialHeading>Lenguaje de señas</TestimonialHeading>
                  <TestimonialText>
                    Desde la camara de tu computadora traduce a tiempo real el
                    lenguaje de señas (Alfabeto Americano) al español y k'iche'
                  </TestimonialText>
                </TestimonialContent>
                <TestimonialAvatar
                  src={
                    "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
                  }
                  name={"Lenguaje de señas"}
                />
              </Testimonial>
            </Stack>
          </Container>
        </Box>
      </Box>
    </>
  )
}

const Testimonial = ({ children }) => {
  return <Box>{children}</Box>
}

const TestimonialContent = ({ children }) => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      boxShadow={"lg"}
      p={8}
      rounded={"xl"}
      align={"center"}
      pos={"relative"}
      _after={{
        content: `""`,
        w: 0,
        h: 0,
        borderLeft: "solid transparent",
        borderLeftWidth: 16,
        borderRight: "solid transparent",
        borderRightWidth: 16,
        borderTop: "solid",
        borderTopWidth: 16,
        borderTopColor: useColorModeValue("white", "gray.800"),
        pos: "absolute",
        bottom: "-16px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {children}
    </Stack>
  )
}

const TestimonialHeading = ({ children }) => {
  return (
    <Heading as={"h3"} fontSize={"xl"}>
      {children}
    </Heading>
  )
}

const TestimonialText = ({ children }) => {
  return (
    <Text
      textAlign={"center"}
      color={useColorModeValue("gray.600", "gray.400")}
      fontSize={"sm"}
    >
      {children}
    </Text>
  )
}

const TestimonialAvatar = ({ src, name, title }) => {
  return (
    <Flex align={"center"} mt={8} direction={"column"}>
      <Avatar src={src} alt={name} mb={2} />
      <Stack spacing={-1} align={"center"}>
        <Text fontWeight={600}>{name}</Text>
        <Text fontSize={"sm"} color={useColorModeValue("gray.600", "gray.400")}>
          {title}
        </Text>
      </Stack>
    </Flex>
  )
}

export function NavBar() {
  return (
    <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <HStack spacing={8} alignItems={"center"}>
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.map(link => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>
      </Flex>
    </Box>
  )
}

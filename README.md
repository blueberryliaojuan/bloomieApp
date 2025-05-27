# Bloomie Flower Store App 🌸

**ReactNative + Expo Project**

Bloomie is a flower store offering both in-store and online shopping options.

---

## Resources

### Design:

- **Figma Project**: [Bloomie Design](https://www.figma.com/design/m24HAz42h3DNXgcbUf4PFJ/Bloomie?node-id=0-1&p=f&t=xv0EKzgGbUqhsPBj-0)
- **Prototype**: [Bloomie App Prototype](https://www.figma.com/proto/m24HAz42h3DNXgcbUf4PFJ/Bloomie?node-id=32-175&node-type=canvas&t=5SbDYwfoUMlI4P4f-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=32%3A128&show-proto-sidebar=1)

---

## Setup Instructions

### github: [BloomieApp](https://github.com/blueberryliaojuan/bloomieApp)

### Dependencies:

- CSS: [NativeWind](https://www.nativewind.dev/docs)
- Icons：[ionicons](https://ionic.io/ionicons)
- JSON Server: [typicode/json-server](https://github.com/typicode/json-server)

### API Integration

- The API is powered by a local JSON Server.
- API details are documented in the `API.md` file.
- JSON data is stored in the `db.json` file.

### Installation Steps:

1. Install project dependencies: npm i
2. Set up the JSON Server:
   npm db
3. Start the development server: npm run start

---

## Challenges and what I Learned:

1. This was a group design project with Ju and Kiko, and we plan to develop it using React Native this term. However, while coding, I noticed the design needs some refinement, which we will work on together later.
2. JSON Server current version 1.0.0-beta does not support "name_like=" queries. To use this feature, you should switch to version @0.17.4. Additionally, the newer version resolves the "Network request failed" issue. To ensure the server listens on all network interfaces and not just the loopback address, include the --host 0.0.0.0 flag when starting the server.
3. React Native emulators often need special handling for local servers.For iOS Simulator: http://127.0.0.1:3000/flowers works fine. So it's better set a variable and check platform at beginning.
4.

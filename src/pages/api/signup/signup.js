// @ts-nocheck
import * as formidable from "formidable";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import * as fs from "fs";
import User from "../../models/user";
import bcrypt from "bcrypt";

export const config = {
  api: {
    bodyParser: false,
  },
};

const saltRounds = 10;

const validateFields = (fields) => {
  const requiredFields = [
    "role",
    "email",
    "tagline",
    "restaurantName",
    "cnicNumber",
    "restaurantOwner",
    "mobile",
    "zipcode",
    "address",
    "landmark",
    "city",
    "state",
  ];
  for (const field of requiredFields) {
    if (!fields[field] || fields[field].length === 0) {
      return `${field} is required.`;
    }
  }
  return null;
};

// Main API handler
export default async function handler(req, res) {
  console.log("Received request:", req.method);
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const uploadDir = path.join(process.cwd(), "/data");
  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  // Parse the incoming form data
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error parsing the form:", err);
      return res.status(500).json({ message: "Error parsing form data" });
    }

    // Validate form fields
    const validationError = validateFields(fields);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    try {
      // Destructure the fields for easier access
      const {
        role,
        email,
        tagline,
        restaurantName,
        cnicNumber,
        restaurantOwner,
        mobile,
        zipcode,
        address,
        landmark,
        city,
        state,
      } = fields;

      // Handle file upload
      let imageFilename = "";
      const uploadedFile = files.logo;

      if (uploadedFile && uploadedFile.length > 0) {
        const uniqueId = uuidv4();
        const oldPath = uploadedFile[0].filepath;
        imageFilename = `${uniqueId}_${uploadedFile[0].originalFilename}`;
        const newPath = path.join(uploadDir, imageFilename);
        fs.renameSync(oldPath, newPath); // Rename file
      }

      // Hash the password
      // const hash = await bcrypt.hash(password[0], saltRounds);

      // Create the user in the database
      const createdUser = await User.create({
        email: email[0],
        // password: hash,
        role: role[0],
        restaurantDetails: {
          logo: imageFilename,
          tagline: tagline[0],
          restaurantName: restaurantName[0],
          cnicNumber: cnicNumber[0].replace(/[^0-9]/g, ""),
          restaurantOwner: restaurantOwner[0],
        },
        addressDetails: {
          mobile: mobile[0],
          zipcode: zipcode[0],
          address: address[0],
          landmark: landmark[0],
          city: city[0],
          state: state[0],
        },
      });

      return res
        .status(200)
        .json({ message: "User created successfully", createdUser });
    } catch (error) {
      console.error("Error handling signup:", error);
      return res.status(500).json({ message: "Error processing signup" });
    }
  });
}

// import User from "../../models/user";
// import bcrypt from 'bcrypt';
// let saltRounds = 10;

// export default async function handler(req, res) {
//   if (req.method === "POST") {
//     try {
//       console.log("hit Signup..?", req.formData());

// const { role, email, password, username, restaurantDetails, addressDetails } = req.body;

// // Validate input fields
// if (!email || !password || !role) {
//   return res.status(400).json({ message: "Email, password, and user type are required." });
// }

//       if(restaurantDetails.logo === undefined){
//         const bytes = await image.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         // Generate a unique filename for the image
//         const imageFilename = `${uniqueId}_${uuidv4()}_${image.name}`;
//         // Add the filename to the uniqueImageFilenames array
//         uniqueImageFilenames.push({ name: imageFilename });
//         // Save the file to the server with the unique filename
//         const path = `../data/${imageFilename}`;
//         await writeFile(path, buffer);
//       }

// // Hash the password
// const hash = await bcrypt.hash(password, saltRounds);

// const logo = restaurantDetails.logo; // Assuming logo is sent as Base64 string
// console.log("logoBase64:", logo);
// // Create the user
// const createdUser = await User.create({
//   email,
//   password: hash,
//   role,
//   restaurantDetails: {
//     logo: logo || '',
//     tagline: restaurantDetails.tagline || '',
//     restaurantName: restaurantDetails.restaurantName,
//     cnicNumber: restaurantDetails.cnicNumber.replace(/[^0-9]/g, ''),
//     restaurantOwner: restaurantDetails.restaurantOwner
//   },
//   addressDetails: {
//     mobile: addressDetails.mobile,
//     zipcode: addressDetails.zipcode,
//     address: addressDetails.address,
//     landmark: addressDetails.landmark,
//     city: addressDetails.city,
//     state: addressDetails.state
//   }
// });

// return res.status(200).json({ message: "User created successfully", createdUser });
//     } catch (error) {
//       console.error("Error creating user:", error);
//       return res.status(500).json({ message: "Error creating user" });
//     }
//   } else {
//     return res.status(405).json({ message: "Method Not Allowed" });
//   }
// }

// // Parse the request body to get the input fields
//    const { role, email, password, username, restaurantDetails, addressDetails } = await request.json();

//    console.log("Request received for Signup:", { role, email, restaurantDetails, addressDetails });

//    // Validate input fields
//    if (!email || !password || !role) {
//      return NextResponse.json({ status: 400, message: "Email, password, and user type are required." });
//    }

//   let hash;
//   let createdUser;

//   // Check if the password is valid
//   if (!password || password.trim().length === 0) {
//     return NextResponse.json({ status: 400, message: "Password cannot be empty" });
//   }

//   // Handle user types and create users accordingly
//   // if (role === "Admin") {
//   //   // Hash the password
//   //   hash = await bcrypt.hash(password, saltRounds);

//   //   // Create an admin user
//   //   createdUser = await User.create({
//   //     username,
//   //     email,
//   //     password: hash,
//   //     role
//   //   });
//   // } else
//   if (role === "Resturant") {
//     // Additional checks or validations for restaurant fields can be added here

//     // Hash the password
//     hash = await bcrypt.hash(password, saltRounds);

//     // Create a restaurant user with restaurant and address details
//     createdUser = await User.create({
//       email,
//       password: hash,
//       role,
//       restaurantDetails: {
//         logo: restaurantDetails.logo || '',
//         tagline: restaurantDetails.tagline || '',
//         restaurantName: restaurantDetails.restaurantName,
//         cnicNumber: restaurantDetails.cnicNumber.replace(/[^0-9]/g, ''),
//         restaurantOwner: restaurantDetails.restaurantOwner
//       },
//       addressDetails: {
//         mobile: addressDetails.mobile,
//         zipcode: addressDetails.zipcode,
//         address: addressDetails.address,
//         landmark: addressDetails.landmark,
//         city: addressDetails.city,
//         state: addressDetails.state
//       }
//     });
//   } else {
//     // Return an error if role is invalid
//     return NextResponse.json({ status: 400, message: "Invalid user type" });
//   }

// export async function POST(request) {
//   console.log("hit..?");

//   try {
//     let { role, resturantname, phonenum, cnic, email, username, password , resturant } = await request.json();
//     let hash;
//     let createdUser;
//     console.log("hit..?",role, resturantname, phonenum, cnic, email, username, password , resturant);

//     if (!password || password.trim().length === 0) {
//       return NextResponse.json({ status: 400, message: "Password cannot be empty" });
//     }

//     if (role === "Admin") {
//       hash = await bcrypt.hash(password, saltRounds);
//       createdUser =  await User.create({ username, email, password: hash, role: role , resturant: resturant });
//     } else if (role === "Resturant") {
//       // Additional checks or validations for admin fields can be added here
//       cnic = cnic.replace(/[^0-9]/g, '');

//       hash = await bcrypt.hash(password, saltRounds);
//       createdUser = await User.create({ resturantname, phonenum, cnic, email, password: hash, role: role });
//     } else {
//       return NextResponse.json({ status: 400, message: "Invalid user type" });
//     }

//     return NextResponse.json({ status: 200, message: "User created successfully" , createdUser: createdUser });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return NextResponse.json({ status: 500, message: "Error creating user" });
//   }
// }

// export async function POST(request) {
//   var { resturantname, phonenum,cnic,email, password } = await request.json();
//    cnic = cnic.replace(/[^0-9]/g, '')
//   const hash = await bcrypt.hash( password, saltRounds );
//   const user = await User.create({ resturantname, phonenum,cnic,email, password :hash   });

//   console.log(user)
//   return NextResponse.json(
//     {
//       msg: "User created Successfully",
//       obj: user
//     },
//     { status: 200 }
//   );
// }

export async function GET(request) {
  const Users = await User.find();
  return NextResponse.json({ Users }, { status: 200 });
}

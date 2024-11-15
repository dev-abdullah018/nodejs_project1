const fs = require("fs/promises");
const { Buffer } = require("buffer");

(async () => {
    const htmlPath = "./index.html";
    const myfilework = await fs.open("./myfile.txt", "r");

    myfilework.on("change", async function () {
        let size = (await myfilework.stat()).size;
        let buf = Buffer.alloc(size);
        let offset = 0;
        let length = buf.byteLength;
        let position = 0;

        await myfilework.read(buf, offset, length, position);
        const myText = buf.toString("utf-8").trim();

        let html = await fs.readFile(htmlPath, "utf-8");

        // handle header
        if (myText.startsWith("create header")) {
            if (!html.includes("<div class='header'>")) {
                html = html.replace("</body>", `
                    <div class="header bg-teal-500 text-white p-16 text-center">
                        <h1 class="text-4xl font-bold">Welcome to My Dynamic Website</h1>
                        <p class="text-lg pt-4">Created with Tailwind CSS and Node.js</p>
                    </div>
                </body>`);
            }
        } else if (myText.startsWith("delete header")) {
            html = html.replace(/<div class="header[^>]*>.*?<\/div>/gs, "");
        }

        
        // handle navbar
        if (myText.startsWith("create navbar")) {
          if (!html.includes("<div class='navbar'>")) {
            html = html.replace("</body>", `
              <div class="navbar bg-gray-800 text-white p-4 flex justify-between">
                <div class="flex space-x-4">
                    <a href="#" class="text-white text-center block px-5 py-3 no-underline hover:bg-gray-300 hover:text-black">Home</a>
                    <a href="#" class="text-white text-center block px-5 py-3 no-underline hover:bg-gray-300 hover:text-black">About</a>
                    <a href="#" class="text-white text-center block px-5 py-3 no-underline hover:bg-gray-300 hover:text-black">Services</a>
                </div>
                <a href="#" class="text-white text-center block px-5 py-3 no-underline hover:bg-gray-300 hover:text-black">Contact</a>
               </div>
             </body>`);
          }
      } else if (myText.startsWith("delete navbar")) {
        html = html.replace(/<div class="navbar[^>]*>.*?<\/div>/gs, "");
    }

   /// handle row 
   if (myText.startsWith("create row")) {
    if (!html.includes("<div class='row'>")) {
        html = html.replace("</body>", `
            <div class="row flex flex-wrap">
              <div class="side w-full md:w-1/3 bg-gray-200 p-5">
                   <h2 class="text-xl font-semibold">About Me</h2>
                   <h5 class="text-lg">Photo of me:</h5>
                   <div class="fakeimg bg-gray-300 w-full" style="height:200px;">Image</div>
                   <p class="mt-4">Some text about me in culpa qui officia deserunt mollit anim..</p>
                   <h3 class="mt-4 text-lg font-medium">More Text</h3>
                   <p class="mt-2">Lorem ipsum dolor sit ame.</p>
                   <div class="fakeimg bg-gray-300 w-full" style="height:60px;">Image</div><br>
                   <div class="fakeimg bg-gray-300 w-full" style="height:60px;">Image</div><br>
                   <div class="fakeimg bg-gray-300 w-full" style="height:60px;">Image</div>
               </div>
              <div class="main w-full md:w-2/3 bg-white p-5">
                 <h2 class="text-xl font-semibold">TITLE HEADING</h2>
                 <h5 class="text-lg">Title description, Dec 7, 2017</h5>
                 <div class="fakeimg bg-gray-300 w-full" style="height:200px;">Image</div>
                 <p class="mt-4">Some text..</p>
                 <p class="mt-2">Sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                 <br>
                 <h2 class="text-xl font-semibold">TITLE HEADING</h2>
                 <h5 class="text-lg">Title description, Sep 2, 2017</h5>
                 <div class="fakeimg bg-gray-300 w-full" style="height:200px;">Image</div>
                 <p class="mt-4">Some text..</p>
                 <p class="mt-2">Sunt in culpa qui officia deserunt mollit anim id est laborum consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
              </div>
              </div>
             </body>`);
         }
     } else if (myText.startsWith("delete row")) {
         html = html.replace(/<div class="row[^>]*>.*?<\/div>/gs, "");
        }

        // handle footer
        if (myText.startsWith("create footer")) {
            if (!html.includes("<div class='footer'>")) {
                html = html.replace("</body>", `
                    <div class="footer bg-gray-200 text-center p-4 mt-4">
                        <p class="text-gray-600">&copy; 2024 My Website</p>
                    </div>
                </body>`);
            }
        } else if (myText.startsWith("delete footer")) {
            html = html.replace(/<div class="footer[^>]*>.*?<\/div>/gs, "");
        }

        // write the updated html content back to the file
        await fs.writeFile(htmlPath, html.trim(), "utf-8");
     });

    const watcher = fs.watch("./myfile.txt");
    for await (let event of watcher) {
        if (event.eventType == "change") {
            myfilework.emit("change");
        }
    }
})();

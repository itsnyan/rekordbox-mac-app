# Rekordbox Collection XML Tool

Rekordbox Collection XML Tool for MacOS (built using web technologies).

Follow up from the rekordbox-cli project, now with a graphical interface to make managing your music even better. 

<img width="600" alt="rb-demo-screenshot" src="https://github.com/user-attachments/assets/0dc0f2ec-6bc1-45d0-aa22-ae64fe73dedb">

## Features

- #### Backup your songs into folders using your Rekordbox playlists.

> When you import your songs into Rekordbox and organize them into playlists, especially when dealing with multiple genres, the original song files remain unorganized on your system. This application addresses that by taking your Rekordbox collection XML, parsing it, and creating a folder for each playlist. It then copies the corresponding songs from each playlist into these folders, effectively organizing your music files.

- #### Duplicate removal feature (coming soon) 🛠️
- #### Deleted track cleanup (coming soon) 🛠️

## Notes

To download and install the application, navigate to the releases section on the right-hand side or click [here](https://github.com/itsnyan/rekordbox-mac-app/releases)

🔧 The v1.0.0 release is currently signed with my developer certificate but hasn't been notarized yet, so you might encounter an error stating that the app is damaged (Apple’s distribution process can be quite restrictive). For more details, check this discussion: Apple Support Thread.

To work around this issue while I’m working on notarizing the app, please follow these steps:

1. Download the app.
2. Open the DMG file.
3. Drag the rekordbox-xml-organizer app into the Applications folder.
4. Before launching the app, open the Terminal application.
5. Enter the following command: xattr -c <path/to/application.app>
6. Now you can launch the application.

💡 A convenient way to obtain the path is to enter xattr -c and then drag the rekordbox-xml-organizer app icon from the Applications folder into the Terminal window. If you need additional assistance, check out the v1.0.0 installation video below.

<details>
  <summary>v1.0.0 Installation tutorial.</summary>
 
  https://github.com/user-attachments/assets/54dc2a6f-e5e8-4d6e-9c83-842a96bf0082

</details>

<details>
  <summary>How to export the collection XML on Rekordbox.
</summary>
  <img width="405" alt="xml-how-to" src="https://github.com/user-attachments/assets/22a8931d-f648-4e6e-90c7-20122a9c12b0">
</details>

<details>
  <summary>v1.0.0 features demo.</summary>

  https://github.com/user-attachments/assets/13b2ba93-f145-4c65-9ee0-8e6aeca97598
  
</details>




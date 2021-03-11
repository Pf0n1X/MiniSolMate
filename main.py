import requests
from bs4 import BeautifulSoup
import re
import pymongo

if __name__ == '__main__':

    URL = 'https://music.apple.com/us/playlist/top-100-global/pl.d25f5d1181894928af76c85c967f8f31'
    page = requests.get(URL)

    soup = BeautifulSoup(page.content, 'html.parser')
    divs = soup.find_all("div", {"class": "row track web-preview song"})

    myclient = pymongo.MongoClient("mongodb://localhost:27017/solmatemini")
    mydb = myclient["mini_solmate"]
    mycol = mydb.create_collection("songs")

    for index in range(len(divs)):
        songName = divs[index].find("div", {"class": "song-name typography-body-tall"})
        artists = divs[index].find("div", {"class": "by-line typography-callout"})
        album = divs[index].find("div", {"class": "col col-album"})
        img = divs[index].find("picture").find("source")["srcset"]
        img = str(img).split(" ")[0]
        if (not img):
            img = divs[index].find("picture").find("source")["data-srcset"]
            img = str(img).split(" ")[0]

        mydict = {"songId": index + 1,
                  "songName": songName.text.replace('\n', ''),
                  "artistName": re.sub(' +', ' ', artists.text.replace('\n', '').strip()),
                  "albumName": album.text.replace('\n', ''),
                  "imgUrl": img}

        mycol.insert_one(mydict)
        print(mydict)

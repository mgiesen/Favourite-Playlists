let PROJECT_DATA = null;
let CURRENT_LIST = null;

const sidebarToggleButton = document.querySelector(".toggle-btn");

sidebarToggleButton.addEventListener("click", function ()
{
    document.querySelector("#sidebar").classList.toggle("expand");
});

document.querySelector('#modalChangeProject .btn-primary').addEventListener('click', openProject);

document.addEventListener("DOMContentLoaded", function ()
{
    // Prüfen ob ein Projekt in der URL übergeben wurde
    const urlParams = new URLSearchParams(window.location.search);
    const projectUrl = urlParams.get('project');

    if (projectUrl)
    {
        loadProject(projectUrl);
    }
    else
    {
        generateOpenProjectDialog();
    }

    //Debugging: ?project=data/projectExample.json
});

function generateOpenProjectDialog()
{
    const mainContainer = document.getElementById("main");
    mainContainer.innerHTML = document.getElementById("t-open-project-dialog").innerHTML;
}

function openProject()
{
    var modalElement = document.getElementById('modalChangeProject');
    var modalInstance = bootstrap.Modal.getInstance(modalElement);
    modalInstance.hide();

    const projectUrlTextbox = document.getElementById('textboxProjectURL');
    var projectUrl = projectUrlTextbox.value;

    projectUrlTextbox.value = "";

    if (projectUrl)
    {
        loadProject(projectUrl);
    }
}

function loadProject(url)
{
    const projectTitle = document.getElementById("projectTitle");
    const sidebar = document.getElementById("sidebar");

    fetch(url)
        .then(response => response.json())
        .then(data =>
        {
            PROJECT_DATA = data;

            if (!PROJECT_DATA)
            {
                return;
            }

            projectTitle.textContent = PROJECT_DATA["project"]["name"];

            if (PROJECT_DATA["primaryColor"] && PROJECT_DATA["secondaryColor"])
            {
                sidebar.style.backgroundColor = PROJECT_DATA["primaryColor"];
                sidebar.style.color = PROJECT_DATA["secondaryColor"];
            }

            loadProjectlists();

        })
        .catch(error =>
        {
            generateOpenProjectDialog();
            console.error('Error:', error);
        });
}

function loadProjectlists()
{
    const lists = PROJECT_DATA["lists"];

    const listsMenu = document.getElementById("lists_overview");
    const listsCountLabel = document.getElementById("listsCountLabel");

    lists.innerHTML = "";

    listsCountLabel.textContent = `(${lists.length})`;

    lists.forEach(list =>
    {
        const listItem = document.createElement("li");
        listItem.classList.add("sidebar-item");

        const listLink = document.createElement("a");
        listLink.href = "#";
        listLink.classList.add("sidebar-link");
        listLink.textContent = list["name"];

        listItem.appendChild(listLink);
        listsMenu.appendChild(listItem);
    });

    loadlist(0);
}

function loadlist(listIndex)
{
    const mainContainer = document.getElementById("main");
    mainContainer.innerHTML = "";

    const list = PROJECT_DATA["lists"][listIndex];

    if (!list)
    {
        return;
    }

    const listTitle = document.createElement("h1");
    listTitle.textContent = list["name"];
    mainContainer.appendChild(listTitle);

    fetch(list.url)
        .then(response => response.json())
        .then(data =>
        {
            CURRENT_LIST = data;
            generatecollection(CURRENT_LIST["collections"]);
        })
        .catch(error => console.error('Error:', error));
}

function generatecollection(collections)
{
    const mainContainer = document.getElementById("main");

    collections.forEach(collection =>
    {
        const collectionTitle = document.createElement("h2");
        collectionTitle.textContent = collection["name"];
        mainContainer.appendChild(collectionTitle);

        const gridContainer = document.createElement("div");
        gridContainer.classList.add("grid-container");

        collection["items"].forEach(item =>
        {
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");

            switch (item["type"])
            {
                case "youtube":
                    handleYouTube(item, gridItem);
                    break;
                case "poster":
                    handlePoster(item, gridItem);
                    break;
                default:
                    console.log("Unsupported item type");
            }

            gridContainer.appendChild(gridItem);
        });

        mainContainer.appendChild(gridContainer);
    });
}

function handleYouTube(item, gridItem)
{
    const itemContainer = document.createElement("a");
    itemContainer.href = item["url"];

    const thumbnail = document.createElement("img");
    thumbnail.src = `https://img.youtube.com/vi/${item["url"].split("v=")[1]}/hqdefault.jpg`;

    const gridItemData = document.createElement("div");
    gridItemData.classList.add("grid-item-data");

    const videoTitle = document.createElement("h3");
    videoTitle.textContent = item["title"];

    const videoDescription = document.createElement("p");
    videoDescription.textContent = item["description"] || "No description available.";

    gridItemData.appendChild(videoTitle);
    gridItemData.appendChild(videoDescription);

    itemContainer.appendChild(thumbnail);
    itemContainer.appendChild(gridItemData);

    gridItem.appendChild(itemContainer);
}

function handlePoster(item, gridItem)
{
    const itemContainer = document.createElement("div");

    const poster = document.createElement("img");
    poster.src = item["image"];

    const gridItemData = document.createElement("div");
    gridItemData.classList.add("grid-item-data");

    const videoTitle = document.createElement("h3");
    videoTitle.textContent = item["title"];

    const videoDescription = document.createElement("p");
    videoDescription.textContent = item["description"] || "No description available.";

    gridItemData.appendChild(videoTitle);
    gridItemData.appendChild(videoDescription);

    itemContainer.appendChild(poster);
    itemContainer.appendChild(gridItemData);

    gridItem.appendChild(itemContainer);
}
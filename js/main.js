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
            lists = data["lists"];
            PROJECT = data["project"];

            if (!PROJECT)
            {
                return;
            }

            projectTitle.textContent = PROJECT["name"];

            if (PROJECT["primaryColor"] && PROJECT["secondaryColor"])
            {
                sidebar.style.backgroundColor = PROJECT["primaryColor"];
                sidebar.style.color = PROJECT["secondaryColor"];
            }

        })
        .catch(error => console.error('Error:', error))
        .finally(() =>
        {
            loadProjectlists();
        });
}

function loadProjectlists()
{
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

    const list = lists[listIndex];

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
            generatePlaylist(CURRENT_LIST["playlists"]);
        })
        .catch(error => console.error('Error:', error));
}

function generatePlaylist(playlists)
{
    const mainContainer = document.getElementById("main");

    playlists.forEach(playlist =>
    {
        const playlistTitle = document.createElement("h2");
        playlistTitle.textContent = playlist["name"];
        mainContainer.appendChild(playlistTitle);

        const gridContainer = document.createElement("div");
        gridContainer.classList.add("grid-container");

        playlist["videos"].forEach(video =>
        {
            const gridItem = document.createElement("div");
            gridItem.classList.add("grid-item");

            const videoLink = document.createElement("a");
            videoLink.href = video["url"];

            const videoImage = document.createElement("img");
            videoImage.src = `https://img.youtube.com/vi/${video["url"].split("v=")[1]}/hqdefault.jpg`;

            const gridItemData = document.createElement("div");
            gridItemData.classList.add("grid-item-data");

            const videoTitle = document.createElement("h3");
            videoTitle.textContent = video["title"];

            const videoDescription = document.createElement("p");
            videoDescription.textContent = video["description"];

            gridItemData.appendChild(videoTitle);
            gridItemData.appendChild(videoDescription);

            videoLink.appendChild(videoImage);
            videoLink.appendChild(gridItemData);

            gridItem.appendChild(videoLink);
            gridContainer.appendChild(gridItem);
        });

        mainContainer.appendChild(gridContainer);
    });
}


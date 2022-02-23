// Html Dynamic Templates for Projects and Filters

function projects(data) {
    return data.map((project, index) => `
        <div class="accordion-item" id="project-${index}">
            <div class="accordion-header" id="heading-${index}">
                <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${index}" aria-expanded="false" aria-controls="collapse-${index}">
                    ${project['Subject']}
                </button>
            </div>
            <div id="collapse-${index}" class="accordion-collapse collapse"
                aria-labelledby="heading-${index}">
                <div class="accordion-body">
                    <div class="row">
                        <div class="col-8">
                            ${project['Applications-Datasets'].map(tag => '<span class="badge bg-light text-dark">' + tag + '</span>').join('\n')}
                            ${project['Techniques'].map(tag => '<span class="badge bg-light text-dark">' + tag + '</span>').join('\n')}
                        </div>
                        <div class="col-4 text-end">
                            ${project['Project'] ? '<span class="badge bg-primary">Project</span>' : ''}
                            ${project['Thesis'] ? '<span class="badge bg-primary">Thesis</span>' : ''}
                            ${project['Internship'] ? '<span class="badge bg-primary">Internship</span>' : ''}
                        </div>
                    </div>
                    <br>
                    <p>${project['Description']}</p>
                </div>
            </div>
        </div>
    `).join('\n') + `<div id="warning" class="text-danger text-center">WARNING: no project satisfies your filters.</div>`
}

function filters(applications, techniques, worktypes) {
    function checkboxes(array, group) {
        // the id of the element is the name of the group of tags plus the name of the element
        // similarly, the onclick routine has the name of the group of tags and passes the element name as an argument 
        return array.map(element => `
            <li class="container navbar-expand-xs">
                <label'><input id="${group}-${element.replace(' ', '-')}" type="checkbox" onclick="${group}('${element}')"> ${element}</label>
            </li>
        `).join('\n')
    }

    return `
        <button class="btn btn-outline-primary dropdown-toggle text-end" type="button" id="applications" data-bs-toggle="dropdown" aria-expanded="false">
            Application\/Dataset
        </button>
        <ul class="dropdown-menu" aria-labelledby="applications">${checkboxes(applications, 'applications')}</ul>
        
        <button class="btn btn-outline-primary dropdown-toggle text-end" type="button" id="techniques" data-bs-toggle="dropdown" aria-expanded="false">
            Technique
        </button>
        <ul class="dropdown-menu" aria-labelledby="techniques">${checkboxes(techniques, 'techniques')}</ul>
        
        <button class="btn btn-outline-primary dropdown-toggle text-end" type="button" id="worktypes" data-bs-toggle="dropdown" aria-expanded="false">
            Type of Work
        </button>
        <ul class="dropdown-menu" aria-labelledby="workypes">${checkboxes(worktypes, 'worktypes')}</ul>
    `
}
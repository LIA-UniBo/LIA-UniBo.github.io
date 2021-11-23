// Custom Scripts

// project data retrieved from the json file
var data

// all the applications-datasets tags
var app_tags

// all the techniques tags
var tec_tags

// all the worktypes tags
var type_tags = ['Project', 'Thesis', 'Internship']

// the selected applications-datasets filters
var app_filters = []

// the selected techniques filters
var tec_filters = []

// the selected worktypes filters
var type_filters = []

// whether or not the project cards are expanded
var expanded = false


$(() => $.getJSON('./projects.json', json => {
    // assigns the data constant (with capitalized tags)
    data = json.map(project => {
        project['Applications-Datasets'] = project['Applications-Datasets'].map(tag => capitalize(tag))
        project['Techniques'] = project['Techniques'].map(tag => capitalize(tag))
        project['Responsible'] = project['Responsible'].map(tag => capitalize(tag))
        return project
    })

    // retrieves the tags by flattening the list of tags then it gets unique values by creating a temporary set
    app_tags = [... new Set(json.flatMap(project => project['Applications-Datasets']))].sort()
    tec_tags = [... new Set(json.flatMap(project => project['Techniques']))].sort()

    // renders the page
    $('#filters').html(filters(app_tags, tec_tags, type_tags))
    $('#projects').html(projects(data))
    filterProjects()
}))

// Show/hide the projects list depending on the filters
function filterProjects() {
    console.log('APP:\n' + app_filters + 'TEC:\n' + tec_filters)

    emptyList = data.map(project => {
        // data passes the filter if all the three conditions are satisfied
        // i.e., either there are no filters or at least one tag is included
        console.log('Benchmarking' in project['Techniques'])
        const app_condition = app_filters.length == 0 || app_filters.some(tag => project['Applications-Datasets'].includes(tag))
        const tec_condition = tec_filters.length == 0 || tec_filters.some(tag => project['Techniques'].includes(tag))
        const type_condition = type_filters.length == 0 || type_filters.filter(tag => project[tag]).length > 0
        return app_condition && tec_condition && type_condition
    }).map((show, index) => {
        // at this point, depending on the boolean value, the <div> is retrieved via id and shown or hidden, respectively
        if (show) {
            $('#project-' + index).show()
        } else {
            $('#project-' + index).hide()
        }
        return show
    }).filter(show => show).length == 0
    // if the list is empty, shows the warning <div>, otherwise it hides that
    if (emptyList) {
        $('#warning').show()
    } else {
        $('#warning').hide()
    }
}

// Accordion function: either expands or collapses all the project cards

function toggle_button() {
    if (expanded) {
        $('.collapse').collapse('hide')
        $('#toggle').text('Expand')
        expanded = false
    } else {
        $('.collapse').collapse('show')
        $('#toggle').text('Collapse')
        expanded = true
    }
}

function toggle_project() {
    
}

// Filtering functions: checks whether the checkbox has been activated or deactivated,
// then, it either pushes the element (caller) in the filtering list or deletes it and renders the projects again

function applications(caller) {
    console.log()
    if ($('#applications-' + caller.replace(' ', '-'))[0].checked) {
        app_filters.push(caller)
    } else {
        app_filters = app_filters.filter(tag => tag != caller)
    }
    filterProjects()
}

function techniques(caller) {
    if ($('#techniques-' + caller.replace(' ', '-'))[0].checked) {
        tec_filters.push(caller)
    } else {
        tec_filters = tec_filters.filter(tag => tag != caller)
    }
    filterProjects()
}

function worktypes(caller) {
    if ($('#worktypes-' + caller.replace(' ', '-'))[0].checked) {
        type_filters.push(caller)
    } else {
        type_filters = type_filters.filter(tag => tag != caller)
    }
    filterProjects()
}

// Util functions
function capitalize(string) {
    return string.trim().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
}
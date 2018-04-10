(function() {
  const addBtn = document.querySelector('#btn-add')
  addBtn.addEventListener('click', e => {
    const task = document.querySelector('#task').value
    const sanitizedString = sanitize(task)

    if(sanitizedString.trim()) {
      addTask(sanitizedString)
    } else {
      alert('Please enter a task. :)')
    }
  })

  // Sanitize string
  function sanitize(str) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return str.replace(reg, (match)=>(map[match]));
  }

  const retrieveDoneFromLocalStorage = () => {
    let data = JSON.parse(localStorage.getItem('done'))
    if(!data) return []
    return data
  }

  const retrieveUndoneFromLocalStorage = () => {
    let data = JSON.parse(localStorage.getItem('undone'))
    if(!data) return []
    return data
  }

  const markDoneEvent = (e) => {
    let index = e.target.id.split('done-')[1]
    let undone = retrieveUndoneFromLocalStorage()
    let done = retrieveDoneFromLocalStorage()
    let resultArray = undone.splice(index, 1)
    done.push(resultArray[0])
    localStorage.setItem('undone', JSON.stringify(undone))
    localStorage.setItem('done', JSON.stringify(done))

    viewUndoneTask()
    viewDoneTask()
    setProgress()
  }

  const markUndoneEvent = (e) => {
    let objToPush
    let index = e.target.id.split('undone-')[1]
    let undone = retrieveUndoneFromLocalStorage()
    let done = retrieveDoneFromLocalStorage()
    let resultArray = done.filter((element, i) => {
      if(i == index) {
        objToPush = element
      }
      return i != index
    })
    undone.push(objToPush)
    localStorage.setItem('undone', JSON.stringify(undone))
    localStorage.setItem('done', JSON.stringify(resultArray))

    viewUndoneTask()
    viewDoneTask()
    setProgress()
  }

  const deleteDoneEvent = (e) => {
    let index = e.target.id.split('delete-done-')[1]
    let done = retrieveDoneFromLocalStorage()
    done.splice(index, 1)
    localStorage.setItem('done', JSON.stringify(done))

    viewDoneTask()
    setProgress()
  }

  const deleteUndoneEvent = (e) => {
    let index = e.target.id.split('delete-undone-')[1]
    let undone = retrieveUndoneFromLocalStorage()
    undone.splice(index, 1)
    localStorage.setItem('undone', JSON.stringify(undone))

    viewUndoneTask()
    setProgress()
  }

  function viewUndoneTask () {
    let listOfTasks = retrieveUndoneFromLocalStorage()
    const undone = document.querySelector('.undone')
    
    if(listOfTasks.length > 0) {
      let DOMFragment = ''
      listOfTasks.forEach((el, i) => {
        DOMFragment += `
          <li>
            <span>${el.task}</span>
            <div class="control">
              
              <button class="mark-done" id="done-${i}">
                <i class="fas fa-check"></i>
              </button>
              <button class="delete-undone" id="delete-undone-${i}">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </li>
        `
      })
      undone.innerHTML = DOMFragment
      
      let markDone = document.querySelectorAll('.mark-done')
      markDone.forEach(button => {
        button.addEventListener('click', markDoneEvent)
      })

      let deleteUndone = document.querySelectorAll('.delete-undone')
      deleteUndone.forEach(button => {
        button.addEventListener('click', deleteUndoneEvent)
      })
    } else {
      undone.innerHTML = ''
    }
  }

  function viewDoneTask () {
    let listOfTasks = retrieveDoneFromLocalStorage()
    const done = document.querySelector('.done')
    if(listOfTasks.length > 0) {
      console.log(listOfTasks)
      let DOMFragment = ''
      listOfTasks.forEach((el, i) => {
        DOMFragment += `
          <li class="darken">
            <span class="strikethrough">${el.task}</span>
            <div class="control">
              <button class="mark-undone" id="undone-${i}">
                <i class="fas fa-redo-alt"></i>
              </button>
              <button class="delete-done" id="delete-done-${i}">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </li>
        `
      })
      done.innerHTML = DOMFragment
  
      let markUndone = document.querySelectorAll('.mark-undone')
      markUndone.forEach(button => {
        button.addEventListener('click', markUndoneEvent)
      })
  
      let deleteDone = document.querySelectorAll('.delete-done')
      deleteDone.forEach(button => {
        button.addEventListener('click', deleteDoneEvent)
      })
    } else {
      done.innerHTML = ''
    }
  }

  const addTask = (task) => {
    let listOfTasks = retrieveUndoneFromLocalStorage()
    listOfTasks.push({ task })
    localStorage.setItem('undone', JSON.stringify(listOfTasks))

    document.querySelector('#task').value = ''

    viewUndoneTask()
    viewDoneTask()
    setProgress()
  }

  // Setting the current date
  var date = new Date();
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  let timeString = `${months[date.getMonth()].substr(0, 3)} ${date.getDate()}, ${date.getFullYear()}`
  document.getElementById("time").innerHTML = timeString

  // Setting the current progress
  function setProgress() {
    let undone = retrieveUndoneFromLocalStorage()
    let done = retrieveDoneFromLocalStorage()

    let totalTasks = undone.length + done.length
    let percentage = Math.round(done.length / totalTasks * 100)
    document.getElementById("progress").innerHTML = `${percentage ? percentage : 0}% done`
  }

  viewUndoneTask()
  viewDoneTask()
  setProgress()

})()
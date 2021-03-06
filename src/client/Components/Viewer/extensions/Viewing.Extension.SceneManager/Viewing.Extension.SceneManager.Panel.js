/////////////////////////////////////////////////////////////////////
// Viewing.Extension.SceneManager.Panel
// by Philippe Leefsma, Feb 2016
//
/////////////////////////////////////////////////////////////////////
import './Viewing.Extension.SceneManager.css'
import ToolPanelBase from 'ToolPanelBase'
import dragula from 'dragula'
import './dragula.css'

export default class SceneManagerPanel extends ToolPanelBase{

  constructor(container, btnElement) {

    super(container, 'Scene Manager', {
      buttonElement: btnElement,
      closable: true,
      movable: true,
      shadow: true
    })

    $(this.container).addClass('scene-manager')

    $(`#${this.container.id}-save-btn`).click((e)=>{

      var $name = $(`#${this.container.id}-name`)

      var state = this.emit('scene.add', {name: $name.val()})

      this.addItem(state)

      $name.val('')
    })

    this.drake = dragula(
      [$(`#${this.container.id}-item-list`)[0]],
      {removeOnSpill: false})

    this.drake.on('drop', ()=> {

      var sequence = []

      $(`#${this.container.id}-item-list > div`).each(
        (idx, child)=> {
          sequence.push(child.id)
        })

      this.emit('sequence.update', sequence)
    })

    this.drake.on('drag', (el)=> {

    })
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  htmlContent(id) {

    return `

      <div class="container">
        <div>
          <button id="${id}-save-btn"
                  class="btn btn-info btn-save">
            <span class="glyphicon glyphicon-save-file btn-span-list">
            </span>
            Save Scene
          </button>
        </div>
        <input id="${id}-name" type="text" class="input-name"
               placeholder=" Scene Name ...">
        <div class="item-list" id="${id}-item-list">
        </div>
      </div>`
  }

  /////////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////////
  addItem(item) {

    var itemHtml = `

        <div id="${item.guid}" class="scene-list-group-item">
            ${item.name}
             <button id="${item.guid}-delete-btn"
                    class="btn btn-danger scene-btn-list">
              <span class="glyphicon-remove scene-btn-span-list">
              </span>
            </button>
        </div>
      `

    $(`#${this.container.id}-item-list`).append(itemHtml)

    if(item.readonly){

      $(`#${item.guid}-delete-btn`).css({display:'none'})
    }

    var $item = $(`#${item.guid}`)

    $(`#${item.guid}-delete-btn`).click((e)=>{

      this.emit('scene.remove', item)
      $item.remove()
    })

    $item.click((e)=> {

      e.preventDefault()

      var element = document.elementFromPoint(
        e.pageX,
        e.pageY)

      if (element.className.indexOf('list-group-item') > -1) {

        this.emit('scene.restore', item)
      }
    })
  }
}
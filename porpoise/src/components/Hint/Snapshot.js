/**
 * @file snapshot 弹窗
 * @author chenjianfeng@haizhi.com
 */
import React from 'react'
import { Rodal } from '../rodal'
import { togglePhotoType } from '../../actions/Chart'
import { connect } from 'react-redux'

// ie9-不支持btoa
import newBtoa from 'btoa'
import $ from 'jquery'
window.jQuery = $
window.$ = $
import 'jquery-jcrop'
import './assets/css/jquery.Jcrop.min.css'

class Snapshot extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: this.props.isPhoto,
      cropper: '',
      companyName: this.props.companyName
    }
  }
  componentDidMount () {
    let self = this
    var cssDom = document.createElement('style')
    cssDom.type = 'text/css'
    cssDom.innerHTML = '.chart-container .node image{cursor:pointer}.chart-container .node .circle{fill:#fff;stroke:#d4dadf;stroke-width:2px}.chart-container .node.blur-node .circle{fill:#fbfbfb}.chart-container .node.start-node .circle{fill:lime;stroke-width:0px}.chart-container .node.end-node .circle{fill:red;stroke-width:0px}.chart-container .node.current-node .circle,.chart-container .node.current-node[node-type=Person] .circle{fill:#f18424;stroke-width:0px}.chart-container .node.current-node[node-type=Company] .circle{fill:#008cff;stroke-width:0px}.chart-container .node.current-node[node-type=Bid_detail] .circle{fill:#8b72e5;stroke-width:0px}.chart-container .node.current-node[node-type=Court_bulletin_doc] .circle{fill:#757f89;stroke-width:0px}.chart-container .node.current-node[node-type=Judge_process] .circle{fill:#b99465;stroke-width:0px}.chart-container .node.current-node[node-type=Judgement_wenshu] .circle{fill:#d7a048;stroke-width:0px}.chart-container .node.current-node[node-type=Court_announcement_doc] .circle{fill:#6e80de;stroke-width:0px}.chart-container .node.current-node[node-type=Company_belong] .circle{fill:#5ebc00;stroke-width:0px}.chart-container .node.hover-node .circle,.chart-container .node.hover-node[node-type=Person] .circle{fill:rgba(241,132,36,.6);stroke-width:0px}.chart-container .node.hover-node[node-type=Company] .circle{fill:rgba(0,140,255,.6);stroke-width:0px}.chart-container .node.hover-node[node-type=Bid_detail] .circle{fill:rgba(139,114,229,.6);stroke-width:0px}.chart-container .node.hover-node[node-type=Court_bulletin_doc] .circle{fill:hsla(210,8%,50%,.6);stroke-width:0px}.chart-container .node.hover-node[node-type=Judge_process] .circle{fill:hsla(34,38%,56%,.6);stroke-width:0px}.chart-container .node.hover-node[node-type=Judgement_wenshu] .circle{fill:rgba(215,160,72,.6);stroke-width:0px}.chart-container .node.hover-node[node-type=Court_announcement_doc] .circle{fill:rgba(110,128,222,.6);stroke-width:0px}.chart-container .node.hover-node[node-type=Company_belong] .circle{fill:rgba(94,188,0,.6);stroke-width:0px}.chart-container .node[node-type=shareholder_mergeNode] .circle{fill:#7a67cb;stroke-width:0px}.chart-container .node[node-type=money_flow_mergeNode] .circle{fill:#f97411;stroke-width:0px}.chart-container .node[node-type=officer_mergeNode] .circle{fill:#7f9eff;stroke-width:0px}.chart-container .node[node-type=invest_mergeNode] .circle{fill:#c3cd45;stroke-width:0px}.chart-container .node[node-type=concert_mergeNode] .circle{fill:#41c7ca;stroke-width:0px}.chart-container .node[node-type=sue_mergeNode] .circle{fill:#c9165d;stroke-width:0px}.chart-container .node[node-type=bid_mergeNode] .circle{fill:#3d79d8;stroke-width:0px}.chart-container .node[node-type=guarantee_mergeNode] .circle{fill:#f8090c;stroke-width:0px}.chart-container .node[node-type=out_control_shareholder_mergeNode] .circle{fill:#109e52;stroke-width:0px}.chart-container .node[node-type=out_actual_controller_mergeNode] .circle{fill:#90d055;stroke-width:0px}.chart-container .node.current-node[node-type=shareholder_mergeNode] .circle,.chart-container .node.hover-node[node-type=shareholder_mergeNode] .circle{stroke-width:3px;stroke:rgba(122,103,203,.4)}.chart-container .node.current-node[node-type=money_flow_mergeNode] .circle,.chart-container .node.hover-node[node-type=money_flow_mergeNode] .circle{stroke-width:3px;stroke:rgba(249,116,17,.4)}.chart-container .node.current-node[node-type=officer_mergeNode] .circle,.chart-container .node.hover-node[node-type=officer_mergeNode] .circle{stroke-width:3px;stroke:rgba(127,158,255,.4)}.chart-container .node.current-node[node-type=invest_mergeNode] .circle,.chart-container .node.hover-node[node-type=invest_mergeNode] .circle{stroke-width:3px;stroke:rgba(195,205,69,.4)}.chart-container .node.current-node[node-type=concert_mergeNode] .circle,.chart-container .node.hover-node[node-type=concert_mergeNode] .circle{stroke-width:3px;stroke:rgba(65,199,202,.4)}.chart-container .node.current-node[node-type=sue_mergeNode] .circle,.chart-container .node.hover-node[node-type=sue_mergeNode] .circle{stroke-width:3px;stroke:rgba(201,22,93,.4)}.chart-container .node.current-node[node-type=bid_mergeNode] .circle,.chart-container .node.hover-node[node-type=bid_mergeNode] .circle{stroke-width:3px;stroke:rgba(61,121,216,.4)}.chart-container .node.current-node[node-type=guarantee_mergeNode] .circle,.chart-container .node.hover-node[node-type=guarantee_mergeNode] .circle{stroke-width:3px;stroke:rgba(248,9,12,.4)}.chart-container .node.current-node[node-type=out_control_shareholder_mergeNode] .circle,.chart-container .node.hover-node[node-type=out_control_shareholder_mergeNode] .circle{stroke-width:3px;stroke:rgba(16,158,82,.4)}.chart-container .node.current-node[node-type=out_actual_controller_mergeNode] .circle,.chart-container .node.hover-node[node-type=out_actual_controller_mergeNode] .circle{stroke-width:3px;stroke:rgba(144,208,85,.4)}.chart-container .node-name{stroke:none;fill:#44494f}.chart-container .node-name.node-name-blur{fill:#a3a9b0}.chart-container .node-name.node-name-highlight{fill:#475461;font-weight:700}.chart-container .node-name .risk-status{fill:#d00001}.chart-container .link-name{fill:#a3a9b0;text-anchor:middle}.chart-container .link-name.officer{fill:#ffcea2}.chart-container .link-name.invest{fill:#a9d9ff}.chart-container .link-name.actual_controller,.chart-container .link-name.concert,.chart-container .link-name.control_shareholder,.chart-container .link-name.control_shareholders,.chart-container .link-name.guarantee{fill:#fc4239}.chart-container .link-name.link-name-highlight{fill:#475461}.chart-container .arrow-marker{fill:#c1c8cf}.chart-container .arrow-marker.invest,.chart-container .arrow-marker.shareholder{fill:#a9d9ff}.chart-container .arrow-marker.officer{fill:#ffcea2}.chart-container .arrow-marker.actual_controller,.chart-container .arrow-marker.concert,.chart-container .arrow-marker.control_shareholder,.chart-container .arrow-marker.control_shareholders,.chart-container .arrow-marker.guarantee{fill:#fc4239}.chart-container .links{cursor:default}.chart-container .links .guarantee:hover,.chart-container .links .money_flow:hover,.chart-container .links .personal_money_flow:hover{cursor:pointer}.chart-container .link{stroke:#c1c8cf;fill:none}.chart-container .link.officer{stroke:#ffcea2}.chart-container .link.invest{stroke:#a9d9ff}.chart-container .link.actual_controller,.chart-container .link.concert,.chart-container .link.control_shareholder,.chart-container .link.control_shareholders,.chart-container .link.guarantee{stroke:#fc4239}.chart-container .link.link-highlight{stroke-width:2px}.chart-container .link.link-dashed{stroke-dasharray:5,5}'
    this.styleOutLineToInline(cssDom)
    var $cloneDom = $('#chartSVG').clone()
    $cloneDom.find('svg.chart-container').attr({
      'version': 1.1,
      'style': 'background: white; display: block;-webkit-tap-highlight-color: rgba(0, 0, 0, 0);'
    })

    $cloneDom.find('image[type]').each(function (index, item) {
      let $this = $(this)
      var imgHref = $this.attr('href')
      var path = imgHref.split('.')[0]
      console.log(imgHref)
      $this.removeAttr('xlink:href')
      $.get(imgHref, function (svgString) {
        let svg_dataUrl = 'data:image/svg+xml;base64,' + newBtoa(unescape(encodeURIComponent(svgString)))
        $this.attr('href', svg_dataUrl)
      }, 'text')
    })

    // wait svg load completed
    setTimeout(function () {
      let svgDom = $cloneDom[0].firstElementChild
      let $svgDom = $(svgDom)
      let style_chartLayer = $('.chart-layer')[0].getBoundingClientRect()
      let width =  style_chartLayer.width
      let height = style_chartLayer.height
      let x = style_chartLayer.x
      let y = style_chartLayer.y
      $svgDom.find('.chart-layer').removeAttr('transform')
      $svgDom.find('.chart-layer')[0].setAttribute('transform', 'translate(' + (x > 0 ? -x : x) + ', ' + (y > 0 ? -y : y) + ')')
      $(svgDom).attr('width', width)
      $(svgDom).attr('height', height)
      $('body').append(svgDom)
      // $svgDom.remove()
      var xmlSVG
      if (XMLSerializer) {
        xmlSVG = new XMLSerializer().serializeToString(svgDom)
      } else if (svgDom.xml) {
        xmlSVG = svgDom.xml
      }
      // var dataUrl_svgImg = 'data:image/svg+xml;base64,' + jQuery.base64.encode(unescape(encodeURIComponent(xmlSVG)));
      let dataUrl_svgImg = 'data:image/svg+xml;base64,' + newBtoa(unescape(encodeURIComponent(xmlSVG)))
      // var dataUrl_svgImg = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(xmlSVG)));

      var imageDom = document.getElementById('target')
      var locationInf
      imageDom.onload = function () {
        let jcrop_api
        var boundx
        var boundy

        // Grab some information about the preview pane
        var $preview = $('#preview-pane')
        var $pcnt = $('#preview-pane .preview-container')
        var $pimg = $('#preview-pane .preview-container img')
        var xsize = $pcnt.width()
        var ysize = $pcnt.height()

        $pimg.attr('src', dataUrl_svgImg)
        $('#target').Jcrop({
          onChange: updatePreview,
          onSelect: updatePreview,
          bgColor: 'white',
          bgOpacity: 0.4,
          minSize: [xsize, ysize],
          setSelect:   [0, 0, width, height],
          aspectRatio: xsize / ysize
        }, function () {
          // Use the API to get the real image size
          let bounds = this.getBounds()
          boundx = bounds[0]
          boundy = bounds[1]

          jcrop_api = this
          // jcrop_api.animateTo([100, 100, 400, 300]);

          // Setup and dipslay the interface for "enabled"
          $('#can_click,#can_move,#can_size').attr('checked', 'checked')
          $('#ar_lock,#size_lock,#bg_swap').attr('checked', false)
          $('.requiresjcrop').show()
          // Move the preview into the jcrop container for css positioning
          $preview.appendTo(jcrop_api.ui.holder)
        })

        function updatePreview (c) {
          locationInf = c
          console.log(c)
          if (parseInt(c.w) > 0) {
            let rx = xsize / c.w
            var ry = ysize / c.h

            $pimg.css({
              width: Math.round(rx * boundx) + 'px',
              height: Math.round(ry * boundy) + 'px',
              marginLeft: '-' + Math.round(rx * c.x) + 'px',
              marginTop: '-' + Math.round(ry * c.y) + 'px'
            })
          }
        }
      }
      imageDom.src = dataUrl_svgImg
      $('#crop').on('click', function () {
        let canvas = document.createElement('canvas')
        var $img = $('.jcrop-holder img')
        canvas.width = locationInf.w
        canvas.height = locationInf.h
        canvas.style.backgroundColor = 'white'
        var ctx = canvas.getContext('2d')
        ctx.drawImage(imageDom, locationInf.x, locationInf.y, locationInf.w, locationInf.h, 0, 0, locationInf.w, locationInf.h)
        var a = document.createElement('a')

        // chrome firefox
        if (a.download !== undefined) {
          let dataUrl_canvas = canvas.toDataURL()
          var event = new MouseEvent('click')
          a.download = name || '下载图片名称'
          a.href = dataUrl_canvas
          a.dispatchEvent(event)
        } else { // ie
          self.getImgUrlFromServer(xmlSVG, locationInf, 'png', function (url) {
            self.cropAndDownload(url)
          })
        }
      })
    }, 1500)
  }
  show () {
    this.setState({ visible: true })
  }

  cropAndDownload (url) {
    console.log(window.frames['imgIframe'])
    window.frames['imgIframe'].location.href = url
    this.save()
  }

  save () {
    let self = this
    if (window.frames['imgIframe'].document.readyState != 'complete') {
      setTimeout(function () {
        self.save()
      }, 1000)
    } else {
      window.frames['imgIframe'].document.execCommand('SaveAs')
    }
  }

  /**
   * @desc 将svg img对应的data url传给后端，后端生成一个jpg或png图片，并返回该图片的rul给前端
   *
  */
  getImgUrlFromServer (dataUrl, locationInf, imgType, callback) {
    $.ajax({
      url: '/porpoise/graph/crop',
      method: 'post',
      data: {
        dataUrl: dataUrl,
        locationInf: JSON.stringify(locationInf),
      },
      dataType: 'json',
      success: function (data) {
        callback(data.imgUrl)
        console.log(data.imgUrl)
      }
    })
  }
  compressSpaces (s) {
    return s.replace(/[\s\r\t\n]+/gm, ' ')
  }
  trim (s) {
    return s.replace(/^\s+|\s+$/g, '')
  }

  styleOutLineToInline (cssDom) {
    let cssStrs = this.compressSpaces(cssDom.childNodes[0].data)
    var cssSelectors = cssStrs.split('}')
    for (let i = 0; i < cssSelectors.length; i++) {
      if (this.trim(cssSelectors[i]) != '') {
        let cssSelector = cssSelectors[i].split('{')
        var cssClasses = cssSelector[0].split(',')
        var cssProps = cssSelector[1].split(';')
        for (let j = 0; j < cssClasses.length; j++) {
          let cssClass = this.trim(cssClasses[j])
          if (cssClass != '') {
            for (let k = 0; k < cssProps.length; k++) {
              let prop = cssProps[k].indexOf(':')
              var name = cssProps[k].substr(0, prop)
              var value = cssProps[k].substr(prop + 1, cssProps[k].length - prop)
              if (name != null && value != null) {
                if (name === 'width') {
                  value = $(cssClass).width()
                }
                if (name === 'height') {
                  value = $(cssClass).height()
                }
                $(cssClass).attr(name, value)
              }
            }
          }
        }
      }
    }
  }

  hide () {
    this.setState({ visible: false })
    this.props.togglePhotoType(false)
  }
  uploadImg () {
    // let self = this;
    let imgData = $('#cropCanvasHide canvas')[0].toDataURL('png')
    let aDom = document.createElement('a')
    aDom.setAttribute('href', imgData)
    aDom.setAttribute('download', this.state.companyName + '.png')
    document.body.appendChild(aDom)
    setTimeout(function () {
      aDom.click()
      document.body.removeChild(aDom)
    })
  }

  render () {
    return (
      <div className='loading'>
        <iframe id='imgIframe'></iframe>
        <Rodal visible={this.state.visible}
          closeMaskOnClick
          showCloseButton
          width={400} height={500}
          onClose={this.hide.bind(this)} >
          <img id='target' />
          <button className='uploadImg' id='crop' >下载</button>
        </Rodal>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    isPhoto: state.isPhotoGraph,
    companyName: state.location.query.company
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    togglePhotoType: (isPhoto) => dispatch(togglePhotoType(isPhoto))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Snapshot)

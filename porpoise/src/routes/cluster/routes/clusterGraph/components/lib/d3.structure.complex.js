/**
 * 复杂结构图
 * 用于单一企业视角
 * 使用原生 & ES5书写，便于迁移
 * @author: xyz
 * @date: 2018/9/3
 */

import * as d3 from 'd3'
import { flextree } from 'd3-flextree'
import doraemon from 'services/utils'

function ComplexStructure (config, props) {
  if (!config || !config.data || !config.ele) {
    return
  }

  this.props = props
  this.config = config
  this.config.duration = config.duration || 0
  this.config.W = config.W || 132  // 矩形宽
  this.config.H = config.H || 50  // 矩形高
  this.config.rootH = config.rootH || 38  // 根节点高
  this.config.levelHeight = config.levelHeight || 150 // 每层高度
  this.config.fontSize = config.fontSize || 12        // 字体大小
  this.config.sameLayerShift = config.sameLayerShift || 200
  this.config.sameLayerLevelHeight = config.sameLayerLevelHeight || 55
  this.config.paddingH = config.paddingH || 16  // 节点 horizontal
  this.config.nodeSpace = config.nodeSize || 10 // 节点之间的间距
  this.config.HW = config.HW || 32
  this.config.levelHeightH = config.levelHeightH || 152
  this.config.core = config.core || ''  // 集团核心名字
  this.config.tagSize = config.tagSize || 12  // 标签大小

  this.svg = d3.select(config.ele)
  this.data = config.data

  this.svg.selectAll('*').remove()
  this.chartLayer = this.svg.append('g').classed('chart-layer', true)

  this.util = this.generateUtil()
  this.util.setArrow()

  this.clickedNode = null
  // this.clickAgain = false
  this.link = null
}

ComplexStructure.prototype.draw = function () {
  this.initInvest().renderInvest()
    .renderStock()
    .renderSameLayer()
    .bindEvents()
    .initPosition()
    .initStatus()
}

ComplexStructure.prototype.selectNode = function (vertex) {
  if (this.clickedNode && this.clickedNode._id === vertex._id) {
    return
  }
  console.time('高亮结束')
  let _this = this
  this.clickedNode = vertex
  this.link = this.chartLayer.select('.link-group').selectAll('.link')

  // 找到折叠的点
  let toggleIcons = this.svg.selectAll('.toggle-icon').filter((d, i, g) => {
    const vertex = d
    const text = g[i].querySelector('text').innerHTML
    if (vertex.hasToggleIcon && vertex.data.children && _this.util.findOtherHighLightChild.call(_this, vertex.data.children) && text === '+') {
      return true
    }
  })
  toggleIcons && toggleIcons.dispatch('click')
  // 高亮选中的点，清除其他点的高亮
  this.svg.selectAll('.nodes .node').attr('class', function (d, i, g) {
    // d Node节点
    return _this.util.setNodeClass.call(_this, d, g[i])
  })

  this.svg.selectAll('.nodes .link').each(function (d, i, g) {
    d3.select(g[i]).attr('class', function (l) {
      return _this.util.setLinkClass.call(_this, l, g[i])
    })
  })
  console.timeEnd('高亮结束')
}

ComplexStructure.prototype.generateUtil = function () {
  var _this = this

  return {
    hierarchy: function (data) {
      var __this = this
      var root = d3.hierarchy(data)
      root.eachBefore(function (node) {
        node.box = __this.measureText(node.data.properties.name)
        node.id = (node.parent && node.parent.data.properties.name) + '.' + node.data.properties.name
      })
      root.x0 = _this.config.levelHeight / 2
      root.y0 = 0
      return root
    },
    layoutTree: function () {
      return d3.tree()
        .nodeSize([_this.config.W + _this.config.nodeSpace, _this.config.levelHeight])
        .separation(function (a, b) {
          return a.parent === b.parent ? 1 : 1
        })
    },
    dynamicLayoutTree: function () {
      return flextree()
    },
    formatNodeName: function (text) {
      var textWidth = _this.config.W - _this.config.paddingH
      text.each(function (d, idx, g) {
        var thisText = d3.select(g[idx])
        var name = d.data.properties.name
        if (!d.parent) {
          thisText.append('tspan')
            .text(name)
            .attr('x', -d.box.width / 2)
          return
        }
        var fontSize = _this.config.fontSize
        if (!/[\u3400-\u9FBF]/.test(name)) {
          fontSize = fontSize * 3 / 5 // 非中文文字宽度会比 font-size 小
        }
        var len = Math.floor(textWidth / fontSize)
        var lineHeight = _this.config.fontSize + 2
        var maxLineN = 2
        if (name.length / len > maxLineN) {
          name = name.slice(0, (maxLineN * len) - 3) + '...'
        }
        var textStack = []
        var i = 0
        while (name.slice(0, len).length === len) {
          textStack.push({
            name: name.slice(0, len),
            y: lineHeight * i++
          })
          name = name.slice(len)
        }
        textStack.push({
          name: name.slice(0),
          y: lineHeight * i
        })
        textStack.forEach(function (t, i) {
          thisText.append('tspan').text(t.name)
            .attr('x', i === textStack.length - 1 ? -t.name.length * fontSize / 2 : -textWidth / 2)
            .attr('y', t.y)
        })
      })
    },
    appendTags: function (node, type) {
      node.each(function (d, i, g) {
        var thisTag = d3.select(g[i])
        var prop = d.data.properties
        var tagCnt = 0
        var relations = d.data.relations || {}
        if (prop.name === _this.config.core) {
          tagCnt++
          thisTag.append('polygon')
            .attr('class', 'core-star tag')
            .attr('data-name', '集团核心')
            .attr('transform', 'translate(' + (-_this.config.W / 2) + ',0)')
            .attr('points', '70.3087733 9.95015528 66.409737 12 67.1543867 7.65835921 64 4.58359214 68.3592552 3.95015528 70.3087733 0 72.2582915 3.95015528 76.6175467 4.58359214 73.46316 7.65835921 74.2078097 12')
        }

        var isAbnormal = ['吊销', '注销', '清算', '停业', '撤销'].some(function (tag) {
          var business_status = prop.business_status || ''
          return business_status.indexOf(tag) > -1
        })
        var isControlShareholder = !!relations['control_shareholder']
        var isActualController = !!relations['actual_controller']
        if (type === 'invest') {
          isControlShareholder = false
          isActualController = false
        }
        if (prop.belong_inner === true || prop.belong_inner === 'true') {
          appendTag('#98CB6A', '行内客户')
        }
        if (prop.is_listed === true || prop.is_listed === 'true') {
          appendTag('#27B3F4', '上市公司')
        }
        if (doraemon.isBlacklist(d.data.properties)) {
          appendTag('#000', '黑名单企业')
        }
        isAbnormal && appendTag('#D24545', '异常经营状态')
        isControlShareholder && appendTag('#8785EB', '控股股东')
        isActualController && appendTag('#ff9d00', '疑似实际控制人')

        function appendTag (color, name) {
          var tagSize = _this.config.tagSize
          thisTag.append('rect').classed('tag', true).attr('data-name', name)
            .attr('fill', color)
            .attr('stroke', color)
            .attr('width', tagSize)
            .attr('height', tagSize)
            .attr('transform', 'translate(' + (tagCnt++ * tagSize) + ',0)')
        }
      })
    },
    measureText: function (text) {
      if (!text || text.length === 0) return { height: 0, width: 0 }
      var fontSize = _this.config.fontSize
      // 判断是否是汉字，汉字占两字节，数字和英文只占一个字节
      var reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
      var height = fontSize
      if (!reg.test(text)) {
        fontSize = fontSize / 2
        height = fontSize * 2
      }
      var container = d3.select('body').append('svg').attr('class', 'dummy')
      container.append('text')
        .attr('x', -1000)
        .attr('y', -1000)
        .attr('font-size', fontSize)
        .text(text)
      container.remove()
      return { height, width: text.length * fontSize }
    },
    getNodeWidth: function (d) {
      if (d.parent) {
        return _this.config.W
      } else {
        return d.box.width + _this.config.paddingH
      }
    },
    getNodeHeight: function (d) {
      if (d.parent) {
        return _this.config.H
      } else {
        return _this.config.rootH
      }
    },
    nodeAppend: function (node, type) {
      var nodeEnter = node.enter()
        .append('g')
        .attr('class', function (d) {
          var className = 'node ' + type + '-node'
          if (d.depth === 0) {
            className += ' root-node'
          } else {
            if (d.data.properties.is_match) {
              className += ' match-node'
            }
          }
          return className
        })

      nodeEnter.append('rect')
        .attr('width', this.getNodeWidth)
        .attr('height', this.getNodeHeight)
        .attr('x', function (d) {
          return d.parent ? -_this.config.W / 2 : -(d.box.width + _this.config.paddingH) / 2
        })
        .attr('y', function (d) {
          return d.parent ? -_this.config.H / 2 : -_this.config.rootH / 2
        })

      nodeEnter.append('text')
        .attr('class', 'node-name')
        .call(this.formatNodeName)
      nodeEnter.append('title')
        .text(function (d) { return d.data.properties.name })

      nodeEnter.append('g')
        .classed('tags-container', true)
        .attr('transform', function (d, i, g) {
          return 'translate(' +
            (d.depth ? -_this.config.W / 2 : (-d.box.width - _this.config.paddingH) / 2) +
            ',' + ((d.depth ? -_this.config.H / 2 : -_this.config.rootH / 2) - _this.config.tagSize - 4) + ')'
        })
        .call(this.appendTags, type)

      let toggleIcon = nodeEnter.filter((d) => {
        return hasToggleIcon(d)
      }).append("g")
        .classed('toggle-icon', true)
      toggleIcon.append('rect')
        .attr('width', function (d) {
          return hasToggleIcon(d) ? '12px' : '0'
        })
        .attr('height', function (d) {
          return hasToggleIcon(d) ? '12px' : '0'
        })
        .attr('rx', '4px')
        .attr('ry', '4px')
        .attr('x', -6)
        .attr('y', (_this.config.H / 2) + 5)
      toggleIcon.append('text')
        .attr('x', -3.5)
        .attr('y', (_this.config.H / 2) + 14)
        .text(function (d) {
          if (hasToggleIcon(d)) {
            if (d.children) return '-'
            if (d._children) return '+'
          }
          return ''
        })

      return nodeEnter

      function hasToggleIcon (d) {
        return d.depth === 2 && (d.children || d._children) ? (d.hasToggleIcon = true && true) : false
      }
    },
    setArrow: function () {
      var defs = _this.svg.append('defs')
      var arrowMarker = defs.append('marker')
        .attr('refX', 4)
        .attr('id', 'structureArrow')  // 重点是这个引用，使用的时候引用这个id就行
      var arrowMarkerRev = defs.append('marker')
        .attr('refX', 8)
        .attr('id', 'structureArrowRev')
      var arrowMarkerHighLight = defs.append('marker')
        .attr('refX', 4)
        .attr('id', 'structureArrowHighLight')
      var arrowMarkerRevHighLight = defs.append('marker')
        .attr('refX', 8)
        .attr('id', 'structureArrowRevHighLight')
      setArrowProperty(arrowMarker)
      setArrowProperty(arrowMarkerRev)
      setArrowProperty(arrowMarkerHighLight)
      setArrowProperty(arrowMarkerRevHighLight)

      arrowMarker.append('path')
        .attr('d', 'M6,2 L6,10 L0,6 L6,2')
        .attr('fill', '#d1d1d1')
      arrowMarkerRev.append('path')
        .attr('d', 'M2,2 L2,10 L8,6 L2,2')
        .attr('fill', '#d1d1d1')
      arrowMarkerHighLight.append('path')
        .attr('d', 'M6,2 L6,10 L0,6 L6,2')
        .attr('fill', '#475461')
      arrowMarkerRevHighLight.append('path')
        .attr('d', 'M2,2 L2,10 L8,6 L2,2')
        .attr('fill', '#475461')

      function setArrowProperty (marker) {
        marker
          .attr('markerUnits', 'strokeWidth')
          .attr('markerWidth', 12)
          .attr('markerHeight', 12)
          .attr('viewBox', '0 0 12 12')
          .attr('refY', 6)
          .attr('orient', 'auto')
      }
    },
    setNodeAndLinkClass: function () {
      let _this = this
      _this.svg.selectAll('.nodes .node').attr('class', function (d, i, g) {
        return _this.util.setNodeClass.call(_this, d, g[i])
      })

      _this.svg.selectAll('.nodes .link').each(function (d, i, g) {
        d3.select(g[i]).attr('class', function (l) {
          return _this.util.setLinkClass.call(_this, l, g[i])
        })
      })
    },
    /**
     * 设置节点class
     * @param {Object} vertex vertex
     * @return {String} class name
     */
    setNodeClass: function (vertex, node) {
      var _this = this
      var nodeClass = d3.select(node).attr('class')
      var className = ''
      if (nodeClass.includes('root-node')) {
        className = 'node root-node'
      } else if (nodeClass.includes('match-node')) {
        className = 'node match-node'
      } else if (nodeClass.includes('same-layer-node')) {
        className = 'node same-layer-node'
      } else {
        className = 'node'
      }
      if (nodeClass.indexOf('invest-node') !== -1) {
        className += ' invest-node'
      } else if (nodeClass.indexOf('stock-node') !== -1) {
        className += ' stock-node'
      }
      if (!this.clickedNode) {
        return className
      }
      if (d3.event && d3.event.target.nodeName === 'svg') {
        return className
      }
      if (this.util.isHighlightNode.call(_this, vertex)) {
        return className + ' current-node'
      }
      if (!this.util.isLinkToHighlightNode.call(_this, vertex)) {
        return className + ' blur-node'
      }
      return className
    },
    /**
     * 设置边class
     * @param {Object} vertex node
     * @param {Object} link edge
     * @return {Object} class name
     */
    setLinkClass: function (vertex, link) {
      var _this = this
      var _link = d3.select(link)
      var _linkClass = _link.attr('class')
      const links = ['invest-link', 'stock-link', 'same-layer-link']
      let className = links.filter((l) => {
        return _linkClass.includes(l)
      }) + ' link'
      var highlightNodeId = this.clickedNode && this.clickedNode._id
      var vertexId = vertex.data.properties._id
      if (vertex.parent) {
        var hasHightLightChild = _this.util.findHightLightChild.call(_this, vertex)
      }
      if (!this.clickedNode) {
        if (_linkClass.includes('invest-link') || _linkClass.includes('same-layer-link')) {
          _link.attr('marker-end', function (d) {
            return _this.util.getArrow(d, _this, 'invest')
          })
        } else {
          _link.attr('marker-start', function (d) {
            return _this.util.getArrow(d, _this, 'stock')
          })
        }
      }
      if (highlightNodeId) {
        if (!vertex.parent || vertexId === highlightNodeId || hasHightLightChild) {
          className += ' link-highlight'
          if (_linkClass.includes('invest-link') || _linkClass.includes('same-layer-link')) {
            _link.attr('marker-end', function (d) {
              return _this.util.getArrow(d, _this, 'invest')
            })
          } else {
            _link.attr('marker-start', function (d) {
              return _this.util.getArrow(d, _this, 'stock')
            })
          }
        } else {
          if (_linkClass.includes('invest-link') || _linkClass.includes('same-layer-link')) {
            _link.attr('marker-end', function (d) {
              return _this.util.getArrow(d, _this, 'invest')
            })
          } else {
            _link.attr('marker-start', function (d) {
              return _this.util.getArrow(d, _this, 'stock')
            })
          }
          className += ' link-blur'
        }
      }
      // else {
      //   if ((_linkClass.includes(this.clickedNode.type) && !vertexId && this.clickedNode.depth === vertex.depth) || hasHightLightChild) {
      //     className += ' link-highlight'
      //   } else {
      //     className += ' link-blur'
      //   }
      //   if (_linkClass.includes('invest-link') || _linkClass.includes('same-layer-link')) {
      //     _link.attr('marker-end', function (d) {
      //       return _this.util.getArrow(d, _this, 'invest')
      //     })
      //   } else {
      //     _link.attr('marker-start', function (d) {
      //       return _this.util.getArrow(d, _this, 'stock')
      //     })
      //   }
      // }
      // if (d3.event && d3.event.target.nodeName === 'svg') {
      //   if (_linkClass.includes('invest-link')) {
      //     _link.attr('marker-end', function (d) {
      //       return _this.util.getArrow(d, _this, 'invest')
      //     })
      //   } else {
      //     _link.attr('marker-start', function (d) {
      //       return _this.util.getArrow(d, _this, 'stock')
      //     })
      //   }
      //   return _linkClass
      // }
      return className
    },
    getArrow: function (e, context, type) {
      var highlightNodeId = context.clickedNode && context.clickedNode._id

      // if (!highlightNodeId && e.data.properties.name.includes('其他') && context.clickedNode && context.clickedNode.depth === e.depth && context.clickedNode.type === e.type) {
      //   return type === 'invest' ? 'url(#structureArrowRevHighLight)' : 'url(#structureArrowHighLight)'
      // }
      var vertexId = e.data.properties._id
      if (e.parent) {
        var hasHightLightChild = context.util.findHightLightChild.call(context, e)
      }
      if (!context.clickedNode) {
        return type === 'invest' ? 'url(#structureArrowRev)' : 'url(#structureArrow)'
      }
      if (highlightNodeId) {
        if (!e.parent || vertexId === highlightNodeId || hasHightLightChild) {
          return type === 'invest' ? 'url(#structureArrowRevHighLight)' : 'url(#structureArrowHighLight)'
        }
        return type === 'invest' ? 'url(#structureArrowRev)' : 'url(#structureArrow)'
      } else {
        if ((!vertexId && context.clickedNode.depth === e.depth) || hasHightLightChild) {
          return type === 'invest' ? 'url(#structureArrowRevHighLight)' : 'url(#structureArrowHighLight)'
        } else {
          return type === 'invest' ? 'url(#structureArrowRev)' : 'url(#structureArrow)'
        }
      }
    },
    /**
     * 节点是否要高亮
     * @param {Object} vertex vertex
     * @return {Boolean} 是否要高亮
     */
    isHighlightNode: function (vertex) {
      // if (this.clickAgain) {
      //   return false
      // }
      if (this.clickedNode) {
        return vertex.data.properties._id === this.clickedNode._id
      }
      return false
    },
    /**
     * 节点是否和高亮点相连
     * @param {Object} vertex vertex
     * @return {Boolean} 是否和高亮点相连
     */
    isLinkToHighlightNode: function (vertex) {
      // if (this.clickAgain) {
      //   return false
      // }
      let _this = this
      let highlightNodeId = this.clickedNode && this.clickedNode._id
      let vertexId = vertex.parent && vertex.data.properties._id
      let hasHighlightChild = true
      if (vertex.parent) {
        hasHighlightChild = this.util.findHightLightChild.call(_this, vertex)
      }
      if (!vertex.parent || (vertexId && vertexId === highlightNodeId) || hasHighlightChild) {
        return true
      } else {
        return false
      }
    },
    findHightLightChild: function (vertex) {
      let _this = this
      if (!_this.clickedNode) {
        return false
      }
      // '其他聚合查询' 数据存放在otherchild中
      if (vertex.id.includes('其他') && vertex.data && vertex.data.otherChild) {
        return _this.util.findOtherHighLightChild.call(_this, vertex.data.otherChild)
      }
      // 同一层次的公司查询
      if (vertex.data && vertex.data.isSameLayer && vertex.data.otherChild) {
        return vertex.data.otherChild.includes(_this.clickedNode._id)
      }
      return vertex.data.children && vertex.data.children.find(function (c) {
        // 不能根据depth去判断
        if (_this.clickedNode._id === c.properties._id) {
          return true
        }
        if (c.children || c.otherChild) {
          let childrens = c.children || c.otherChild
          return _this.util.findOtherHighLightChild.call(_this, childrens)
        }
      })
    },
    findOtherHighLightChild: function (childrens) {
      let _this = this
      return childrens.find(function (child) {
        if (child.properties._id === _this.clickedNode._id) {
          return true
        }
        if (child.children || child.otherChild) {
          let childrens = child.children || child.otherChild
          return _this.util.findOtherHighLightChild.call(_this, childrens)
        }
      })
    }
  }
}

ComplexStructure.prototype.initInvest = function () {
  if (!this.data.invest.properties) {
    return this
  }

  // var config = this.config
  this.investRoot = this.util.hierarchy(this.data.invest)
  // this.investTree = flextree() // 节点动态布局，第三层节点为竖状。太麻烦，先不做
  this.investTree = this.util.layoutTree()
  // this.investRoot.eachBefore(function (node) {
  //   if (node.depth === 2) {
  //     node.size = [config.HW + config.nodeSpace, config.levelHeightH]
  //   } else {
  //     node.size = [config.W + config.nodeSpace, config.levelHeight]
  //   }
  // })
  // this.investRoot = this.investTree.hierarchy(this.investRoot)
  this.investTree(this.investRoot)
  // this.investRoot.each(function (node) {
  //   for (var key in node.data.data) {
  //     if (node.data[key] === undefined) {
  //       node.data[key] = node.data.data[key]
  //     }
  //   }
  //   node.box = node.data.box
  //   node.id = node.data.id
  // })

  this.chartLayer.append('g')
    .classed('nodes invest', true)
  this.chartLayer.select('.invest').append('g')
    .classed('invest-link-group link-group', true)
  this.chartLayer.select('.invest').append('g')
    .classed('invest-node-group node-group', true)

  return this
}
ComplexStructure.prototype.reInitInvest = function () {
  this.investTree(this.investRoot)

  return this
}
ComplexStructure.prototype.renderInvest = function (source) {
  if (!this.data.invest.properties) {
    return this
  }

  source = source || this.investRoot
  this.renderInvestLinks(source)
    .renderInvestNodes(source)

  return this
}
ComplexStructure.prototype.renderInvestNodes = function (source) {
  var _this = this
  var nodes = this.investRoot.descendants()
  nodes.forEach(function (d) {
    d.x0 = d.x
    d.y0 = d.y
  })
  var node = this.chartLayer.select('.invest-node-group').selectAll('.invest-node')
    .data(nodes, function (d) {
      return d.id
    })

  var nodeEnter = this.util.nodeAppend(node, 'invest')
  nodeEnter.attr('transform', function (d) {
    return 'translate(' + source.x0 + ',' + source.y0 + ')'
  })

  var nodeUpdate = nodeEnter.merge(node)
  nodeUpdate.transition()
    .duration(this.config.duration)
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + d.y + ')'
    })
  node.exit().remove()

  // label
  var rootNode = this.chartLayer.select('.invest-node.root-node')
  var rootLabel = '投资'
  if (rootNode.select('.tree-name-label label').size() === 0) {
    var textSize = this.util.measureText(rootLabel)
    rootNode.append('rect')
      .classed('tree-name-label-bg label-bg', true)
      .attr('width', textSize.width)
      .attr('height', textSize.height)
      .attr('x', -textSize.width / 2)
      .attr('y', (this.config.levelHeight / 3) - textSize.height)
    rootNode.append('text')
      .classed('tree-name-label label', true)
      .text(rootLabel)
      .attr('x', -textSize.width / 2)
      .attr('y', this.config.levelHeight / 3)
  }
  nodeEnter.each(function (d, i, g) {
    if (d.depth === 0) {
      return
    }

    var ratio = d.data.properties.ratio || '持股'
    var ratioToRoot = d.data.properties.ratioToRoot
    ratio = Number(ratio) !== ratio ? ratio : (ratio * 100).toFixed(2) + '%'
    var textSize = _this.util.measureText(ratio)
    var node = d3.select(g[i])
    node.append('rect')
      .classed('label-bg', true)
      .attr('width', textSize.width / 2)
      .attr('height', ratioToRoot ? textSize.height * 2 : textSize.height)
      .attr('x', -textSize.width / 4)
      .attr('y', -(_this.config.levelHeight / 3) - textSize.height)
    node.append('text')
      .text(ratio)
      .classed('label', true)
      .attr('x', -textSize.width / 2)
      .attr('y', -_this.config.levelHeight / 3)
    if (ratioToRoot) {
      ratioToRoot = (ratioToRoot * 100).toFixed(2) + '%'
      node.append('text')
        .text(ratioToRoot)
        .classed('label indirect-invest-label', true)
        .attr('x', -textSize.width / 2) // 数字宽度小一半
        .attr('y', (-_this.config.levelHeight / 3) + textSize.height)
    }
  })

  return this
}
ComplexStructure.prototype.renderInvestLinks = function (source) {
  source = source || this.investRoot
  var _this = this
  var link = this.chartLayer.select('.invest-link-group').selectAll('.invest-link')
    .data(this.investRoot.descendants().slice(1), function (d) {
      return d.id
    })
  var linkEnter = link.enter()
    .append('path')
    .classed('invest-link link', true)
    .attr('d', function (d) {
      if (d.id === source.id && d.id) {
        d = source
      }
      return generateLinkPath(d)
    })
    .attr('marker-end', 'url(#structureArrowRev)')

  var linkUpdate = linkEnter.merge(link)
  linkUpdate.transition()
    .duration(this.config.duration)
    .attr('d', generateLinkPath)
  link.exit().remove()

  function generateLinkPath (d) {
    var H = _this.config.H
    var levelHeight = _this.config.levelHeight
    return 'M' + d.parent.x + ',' + (d.parent.y + (H / 2)) +
      ' L' + d.parent.x + ',' + (d.parent.y + (levelHeight / 2)) +
      ' L' + d.x + ',' + (d.y - (levelHeight / 2)) +
      ' L' + d.x + ',' + (d.y - (H / 2))
  }

  return this
}

ComplexStructure.prototype.initStock = function () {
  this.stockRoot = this.util.hierarchy(this.data.stock)
  this.stockTree = this.util.layoutTree()
  this.stockTree(this.stockRoot)

  return this
}
ComplexStructure.prototype.renderStock = function (source) {
  if (!this.data.stock.properties) {
    return this
  }

  this.chartLayer.append('g')
    .classed('nodes stock', true)
  this.initStock()

  source = source || this.stockRoot
  this.renderStockLinks(source)
    .renderStockNodes(source)

  return this
}
ComplexStructure.prototype.renderStockNodes = function (source) {
  var _this = this
  var nodes = this.stockRoot.descendants()
  var stockNodesGroup = this.chartLayer.select('.stock').append('g')
    .classed('stock-node-group node-group', true)
  var node = stockNodesGroup.selectAll('.stock-node')
    .data(nodes)

  var nodeEnter = this.util.nodeAppend(node, 'stock')

  var nodeUpdate = nodeEnter.merge(node)
  nodeUpdate.transition()
    .duration(this.config.duration)
    .attr('transform', function (d) {
      return 'translate(' + d.x + ',' + (-d.y) + ')'
    })

  // label
  var rootNode = this.chartLayer.select('.stock-node.root-node')
  var rootLabel = '股东'
  if (rootNode.select('.tree-name-label').size() === 0) {
    var textSize = this.util.measureText(rootLabel)
    rootNode.append('rect')
      .classed('tree-name-label-bg label-bg', true)
      .attr('width', textSize.width)
      .attr('height', textSize.height)
      .attr('x', -textSize.width / 2)
      .attr('y', -(this.config.levelHeight / 3) - textSize.height)
    rootNode.append('text')
      .classed('tree-name-label label', true)
      .text(rootLabel)
      .attr('x', -textSize.width / 2)
      .attr('y', -this.config.levelHeight / 3)
  }
  nodeEnter.each(function (d, i, g) {
    if (d.depth === 0) {
      return
    }

    var ratio = d.data.properties.ratio === 0 ? '' : d.data.properties.ratio
    ratio = Number(ratio) !== ratio ? ratio : (ratio * 100).toFixed(2) + '%'
    var textSize = _this.util.measureText(ratio)
    var node = d3.select(g[i])
    node.append('rect')
      .classed('label-bg', true)
      .attr('width', textSize.width / 2)
      .attr('height', textSize.height)
      .attr('x', -textSize.width / 4)
      .attr('y', (_this.config.levelHeight / 3) - textSize.height)
    node.append('text')
      .text(ratio)
      .classed('label', true)
      .attr('x', -textSize.width / 2) // 数字宽度小一半
      .attr('y', _this.config.levelHeight / 3)
  })

  return this
}
ComplexStructure.prototype.renderStockLinks = function (source) {
  source = source || this.stockRoot
  var _this = this
  var stockLinkGroup = this.chartLayer.select('.stock').append('g')
    .classed('stock-link-group stock-group', true)
  var link = stockLinkGroup.selectAll('.stock-link')
    .data(this.stockRoot.descendants().slice(1))
  var linkEnter = link.enter()
    .append('path')
    .classed('stock-link link', true)
    .attr('d', function (d) {
      var H = _this.config.H
      var levelHeight = _this.config.levelHeight
      return 'M' + d.parent.x + ',' + (d.parent.y - (H / 2)) +
        ' L' + d.parent.x + ',' + (d.parent.y - (levelHeight / 2)) +
        ' L' + d.x + ',' + (-d.y + (levelHeight / 2)) +
        ' L' + d.x + ',' + (-d.y + (H / 2))
    })
    .attr('marker-start', 'url(#structureArrow)')

  return this
}

ComplexStructure.prototype.initSameLayer = function () {
  this.sameLayerRoot = this.util.hierarchy(this.data.sameLayer)
  this.samelayerTree = d3.tree()
    .nodeSize([this.config.sameLayerLevelHeight,
      this.sameLayerRoot.box.width + this.config.sameLayerShift])
  this.samelayerTree(this.sameLayerRoot)

  return this
}
ComplexStructure.prototype.renderSameLayer = function (source) {
  if (!this.data.sameLayer.properties || !this.data.sameLayer.children.length) {
    return this
  }

  this.chartLayer.append('g')
    .classed('nodes same-layer', true)
  this.initSameLayer()

  source = source || this.sameLayerRoot
  this.renderSameLayerLinks(source)
    .renderSameLayerNodes(source)

  return this
}
ComplexStructure.prototype.renderSameLayerNodes = function (source) {
  var _this = this
  var nodes = this.sameLayerRoot.descendants()
  var sameLayerNodeGroup = this.chartLayer.select('.same-layer').append('g')
    .classed('same-layer-node-group node-group', true)
  var node = sameLayerNodeGroup.selectAll('.same-layer-node')
    .data(nodes)

  var nodeEnter = this.util.nodeAppend(node, 'same-layer')

  var nodeUpdate = nodeEnter.merge(node)
  nodeUpdate.transition()
    .duration(this.config.duration)
    .attr('transform', function (d) {
      return 'translate(' + d.y + ',' + d.x + ')'
    })

  // label
  var rootNode = this.chartLayer.select('.same-layer-node.root-node')
  var rootLabel = '同一层级'
  if (rootNode.select('.tree-name-label').size() === 0) {
    var config = this.config
    var rootWidth = this.sameLayerRoot.box.width + config.paddingH
    rootNode.append('text')
      .classed('tree-name-label label', true)
      .text(rootLabel)
      .attr('x', (rootWidth / 2) + 15)  // shift
      .attr('y', -4)
  }
  nodeEnter.each(function (d, i, g) {
    if (d.depth === 0) {
      return
    }

    var label = d.data.relations.label
    var textSize = _this.util.measureText(label)
    var node = d3.select(g[i])
    node.append('text')
      .text(label)
      .classed('label', true)
      .attr('x', -_this.config.W - 20)  // 20，shift
      .attr('y', -4)
  })

  return this
}
ComplexStructure.prototype.renderSameLayerLinks = function (source) {
  source = source || this.sameLayerRoot
  var _this = this
  var config = this.config
  var rootWidth = this.sameLayerRoot.box.width + config.paddingH
  var sameLayerGroup = this.chartLayer.select('.same-layer').append('g')
    .classed('same-layer-link-group same-layer-group', true)
  var link = sameLayerGroup.selectAll('.same-layer-link')
    .data(this.sameLayerRoot.descendants().slice(1))
  var linkEnter = link.enter()
    .append('path')
    .classed('same-layer-link link', true)
    .attr('d', function (d) {
      var W = config.W
      return 'M' + (d.parent.x + (rootWidth / 2)) + ',' + d.parent.y +
        ' L' + (d.parent.x + ((rootWidth + config.sameLayerShift) / 2)) +
        ',' + d.parent.y +
        ' L' + (d.parent.x + ((rootWidth + config.sameLayerShift) / 2)) +
        ',' + d.x +
        ' L' + (d.y - (W / 2)) + ',' + d.x
    })
    .attr('marker-end', 'url(#structureArrowRev)')

  return this
}

ComplexStructure.prototype.bindEvents = function () {
  var _this = this
  var svgContainer = d3.select(this.svg.node().parentNode)
  function zoom () {
    var transform = d3.event.transform
    var scale = transform.k
    _this.chartLayer.attr('transform',
      'translate(' + transform.x + ',' + transform.y + ') ' + 'scale(' + scale + ')')
    _this.config.setZoomStatus({
      scale: scale,
      isMaxScale: scale >= 2,
      isMinScale: scale <= 0.5
    })
  }

  this.zoomListener = d3.zoom().scaleExtent([0.5, 2])
    .on('zoom', zoom)
  this.svg.call(this.zoomListener)

  this.svg.on('click', function () {
    d3.event.preventDefault()
  })
  this.svg.on('dblclick.zoom', null)

  // 点击事件
  this.svg.on('click', function () {
    let _this = this
    if (d3.event && d3.event.target.nodeName === 'svg') {
      _this.clickedNode = null

      _this.util.setNodeAndLinkClass.call(_this)
    }
  }.bind(this))


  this.svg.selectAll('.toggle-icon').on('click', function (d) {
    d3.event.preventDefault()
    var t = d3.select(this).select('text')
    if (t.text() === '-') {
      d._children = d.children
      d.children = null
      t.text('+')
    } else if (t.text() === '+') {
      d.children = d._children
      d._children = null
      t.text('-')
    }
    _this.reInitInvest().renderInvest(d).bindEvents()
  })

  this.svg.selectAll('.indirect-invest-label').on('mouseover', function (d) {
    var labelContainer = svgContainer.append('div')
      .classed('indirect-invest-label-container hover-label-container', true)
      .style('top', d3.event.y - 20 + 'px')
      .style('left', d3.event.x + 20 + 'px')
    labelContainer.append('p')
      .text(d.parent.data.properties.name + ' 持股' + (d.data.properties.ratio * 100).toFixed(2) + '%')
    labelContainer.append('p')
      .text(_this.investRoot.data.properties.name + ' 间接持股' + (d.data.properties.ratioToRoot * 100).toFixed(2) + '%')
  })
  this.svg.selectAll('.indirect-invest-label').on('mouseout', function (d) {
    d3.selectAll('.indirect-invest-label-container').remove()
  })

  this.svg.selectAll('.tag').on('mouseover', function (d, i, g) {
    var thisTag = d3.select(g[i]).node()
    var name = thisTag.dataset.name
    svgContainer.append('p')
      .classed('tag-label hover-label-container', true)
      .style('top', d3.event.y - 20 + 'px')
      .style('left', d3.event.x + 20 + 'px')
      .text(name)
  })
  this.svg.selectAll('.tag').on('mouseout', function (d) {
    d3.selectAll('.tag-label').remove()
  })
  /** 自定义事件 */
  d3.select('body').on('structure_zoom', () => {
    // debugger
    const scale = d3.event.detail.scale || 1 // 缩放比例
    const t = d3.zoomIdentity.translate(this.xShift, this.yShift).scale(scale)
    this.svg.call(this.zoomListener.transform, t)
  })
  return this
}

ComplexStructure.prototype.initPosition = function () {
  var xShift = this.svg.attr('width') / 2
  var yShift = this.svg.attr('height') / 2
  this.xShift = xShift
  this.yShift = yShift
  var t = d3.zoomIdentity.translate(xShift, yShift).scale(1)
  this.svg.call(this.zoomListener.transform, t)

  return this
}

ComplexStructure.prototype.initStatus = function () {
  this.chartLayer.select('.invest').selectAll('.toggle-icon').each(function (d, i, g) {
    if (d.depth === 2) {
      d3.select(g[i]).dispatch('click')
    }
  })

  return this
}

export default ComplexStructure

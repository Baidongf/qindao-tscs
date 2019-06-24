/**
 * 饼状图
 * 全体特征
 * 使用原生 & ES5书写，便于迁移
 * @author: xyz
 * @date: 2018/9/3
 */
// 可配置项：元素、宽高、数据、颜色、半径
import * as d3 from 'd3'
import { EPIPE } from 'constants';

function d3Pie (config) {
  if (!config || !config.data || !config.ele) {
    return
  }

  this.config = config
  this.config.W = config.W || 132  // 矩形宽
  this.config.H = config.H || 50  // 矩形高
  // this.config.outerR = config.outerR || 50 // 外圈半径
  this.config.innerR = config.innerR || 0 // 内圈半径
  this.config.radius = Math.min(this.config.W - 100, this.config.H - 100) / 2
  this.config.colors = config.colors || ['#74F590', '#F56464', '#64BCF5', '#64BCaa', '#64BCbb'] // 展示颜色
  this.config.textMax = config.textMax || 7 // 文本换行限制

  this.svg = d3.select(config.ele)
              .attr('width', this.config.W)
              .attr('height', this.config.H)
  this.data = config.data

  this.svg.selectAll('*').remove()
}
d3Pie.prototype.draw = function () {
  var _self = this
  var color = d3.scaleOrdinal(_self.config.colors)

  // count决定饼状图形状，来源数据没有该字段时需加上
  var pie = d3.pie()
              .sort(null)
              .value(function (d) {
                return d.count
              })

  var path = d3.arc()
                .outerRadius(_self.config.radius)
                .innerRadius(_self.config.innerR)
  // 控制折线起点
  var label = d3.arc()
                .outerRadius(_self.config.radius + 2)
                .innerRadius(_self.config.radius + 2)
  // 控制折线第一个转折点
  var label0 = d3.arc()
                .outerRadius(_self.config.radius + 15)
                .innerRadius(_self.config.radius + 15)

  var g = _self.svg.append('g').attr('transform', 'translate(' + (_self.config.W / 2) + ',' + (_self.config.H / 2) + ')')
  var arc = g.selectAll('.arc')
  .data(pie(_self.data))
  .enter().append('g')
  .attr('class', 'arc')
  arc.append('path')
    .attr('d', path)
    .attr('fill', function (d) {
      return color(d.value)
    })

  var text = arc.append('text')
                .attr('transform', function (d) {
                  var x2 = label0.centroid(d)[0]
                  var y2 = label0.centroid(d)[1]
                  var x3 = x2 < 0 ? x2 - 100 : x2 + 30
                  return 'translate(' + x3 + ',' + y2 + ')'
                })
                .attr('dy', '0.35em')
                .style('width', 60)
                .style('color', '#767676')
                .style('font-size', 12)
                .text(function (d) {
                  if (d.data.content.length > _self.config.textMax) {
                    return d.data.content.slice(0, _self.config.textMax)
                  } else {
                    return d.data.content
                  }
                })
  // 文本换行
  text.append('tspan')
      .attr('x', 0)
      .attr('dy', '1.35em')
      .style('color', '#767676')
      .style('font-size', 12)
      .text(function (d) {
        if (d.data.content.length > _self.config.textMax) {
          return d.data.content.slice(_self.config.textMax)
        } else {
          return
        }
      })

  arc.append('polyline')
    .attr('points', function (d) {
      var x1 = label.centroid(d)[0]
      var y1 = label.centroid(d)[1]
      var x2 = label0.centroid(d)[0]
      var y2 = label0.centroid(d)[1]
      var x3 = x2 < 0 ? x2 - 25 : x2 + 25
      return x3 + ',' + y2 + ' ' + x2 + ',' + y2 + ' ' + x1 + ',' + y1
    })
    .style('fill','none')
    .style('stroke','#E3E3E3')
    .style('stroke-width','1')
}
d3Pie.prototype.bindEvent = function () {

}

export default d3Pie

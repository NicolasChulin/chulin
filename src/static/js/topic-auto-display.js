/**
 * TopicAutoDisplay 试题自动化排布
 * @author  chulin
 * created 2018-05-24 14:00:00
 */
(function (window, document, undefined){

  var TopicAutoDisplay = function (opt) {
    if (typeof opt === 'undefined') opt = {}
    this.pageContCls = 'page-cont'; // 试卷页面盒子class名
    this.topicBoxCls = 'cont-main'; // 试卷页面内容盒子class名
    this.topicPartCls = 'cont-items'; // 试卷单列盒子class名
    this.topicPartContCls = 'cont-box'; // 试卷单列内容盒子class名
    this.topicList = opt.topicList; // 需要展示的题目数据

    // 当前试卷页面内容盒子
    this.topicBoxDom = document.querySelectorAll('.' + this.topicBoxCls)[0];
    // 当前单列内容盒子
    this.topicPartContDom = this.topicBoxDom.querySelectorAll('.' + this.topicPartContCls)[0];

    // 试卷单列限定宽和高
    this.partH = this.topicBoxDom.clientHeight;
    this.partW = this.topicPartContDom.offsetWidth;

    // 临时存放题目选项信息
    this.optionWs = [];
    // 创建临时存放dom
    this.lsBoxCls = 'ls-box';
    this.initDom();

    // 开始展示试题
    this.displayList();
  }

  TopicAutoDisplay.prototype = {
    /**
     * 创建临时存放dom
     */
    initDom: function () {
      var lsBox = document.createElement('div')
      lsBox.setAttribute('class', this.lsBoxCls);
      lsBox.setAttribute('id', this.lsBoxCls);
      document.body.appendChild(lsBox);
    },
    /**
     * 主逻辑，展示题目信息
     */
    displayList: function () {
      var self = this;
      var lsDom = $id(self.lsBoxCls);

      self.topicList.forEach(function (item, index) {
        var dom = self.createPixelDom(item, index);
        var pixelType = self.getPixelType(item);

        if (pixelType === 'option') {
          // 选择项的处理
          lsDom.appendChild(dom);
          self.optionWs.push({
            dom: dom,
            w: dom.clientWidth
          });
        } else {
          // 非选择项的处理
          // 先展示上题的选项，如果有的话
          if (self.optionWs.length) {
            self.appendOptionPixel()
          }
          // 再展示当前题目
          self.appendPixel(dom);
        }
      });
      // 循环完之后，检查最后是否还有选项没有展示
      if (self.optionWs.length) {
        self.appendOptionPixel();
      }
    },
    /**
     * 检查当条内容类型
     * @param  {[String]} contPixel [试题内容]
     * @return {[String]}
     */
    getPixelType: function (contPixel) {
      if (contPixel.indexOf('pQues') > -1) {
        return 'topic';
      } else if (contPixel.indexOf('pOpt') > -1) {
        return 'option';
      } else if (contPixel.indexOf('pDetail') > -1) {
        return 'category';
      }
      return 'infos';
    },
    /**
     * 创建当条试题内容dom
     * @param  {[String]} contPixel [试题内容]
     * @return {[domObject]}
     */
    createPixelDom: function (contPixel) {
      var pixelType = this.getPixelType(contPixel);
      var p = document.createElement('P');
      var cls = 'item-' + pixelType;
      p.setAttribute('class', cls);
      p.innerHTML = contPixel;
      return p;
    },
    /**
     * 展示试题内容Dom
     * @param  {[domObject]} dom [内容Dom]
     */
    appendPixel: function (dom) {
      this.topicPartContDom.appendChild(dom);
      var pch = this.topicPartContDom.offsetHeight;
      if (pch > this.partH) {
        this.topicPartContDom.removeChild(dom);

        var partContIsFull = this.topicBoxDom.querySelectorAll('.' + this.topicPartContCls).length;
        if (partContIsFull === 2) {
          this.createNewTopicBox();
        }
        this.createNewTopicPartCont();

        this.topicPartContDom.appendChild(dom);
      }
    },
    /**
     * 展示试题选项内容Dom
     */
    appendOptionPixel: function () {
      var self = this;
      var cls = self.getOptionType();
      var lsDom = $id(self.lsBoxCls);

      self.optionWs.forEach(function (item) {
        item.dom.setAttribute('class', 'item-option ' + cls);
        self.appendPixel(item.dom);
      });
      lsDom.innerHTML = '';
      self.optionWs = [];
    },
    /**
     * 检查试题选项展示类型
     * @return {[String]}
     */
    getOptionType: function () {
      var type = 'item-option-1';
      for (var i = 0; i < this.optionWs.length; i++) {
        var rate = this.optionWs[i].w / this.partW;
        if (rate > 0.5) {
          type = 'item-option-4';
          return type;
        }
        if (rate > 0.25) type = 'item-option-2';
      }
      return type;
    },
    /**
     * 创建新的试卷页
     */
    createNewTopicBox: function () {
      var pageCont = document.createElement('div');
      pageCont.setAttribute('class', this.pageContCls + ' page-2-col page-to-next');
      topicBox = document.createElement('div');
      topicBox.setAttribute('class', this.topicBoxCls);
      pageCont.appendChild(topicBox);

      $id('page-list').appendChild(pageCont);
      this.topicBoxDom = topicBox;
    },
    /**
     * 创建新的试卷单列
     */
    createNewTopicPartCont: function () {
      var topicPart = document.createElement('div');
      topicPart.setAttribute('class', this.topicPartCls);
      topicPartCont = document.createElement('div');
      topicPartCont.setAttribute('class', this.topicPartContCls);
      topicPart.appendChild(topicPartCont);

      this.topicBoxDom.appendChild(topicPart);
      this.topicPartContDom = topicPartCont;
    }
  }

  function $id (id) {
    return document.getElementById(id);
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = TopicAutoDisplay;
  if (typeof define === 'function') define(function () {return TopicAutoDisplay;});
  window.TopicAutoDisplay = TopicAutoDisplay;

})(window, document);

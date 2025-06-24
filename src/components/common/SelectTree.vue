<template>
  <el-select
      ref="selectRef"
      clearable
      :filterable="filterableFor || remoteFor"
      :remote="filterableFor || remoteFor"
      :remote-method="selectRemoteMethod"
      v-model="currentLabel"
      @visible-change="handleVisibleChange"
      @clear="handleClear"
  >
    <el-option
        style="height: 100%; padding: 0"
        value=""
        v-loading="loading"
        element-loading-text="加载中..."
        element-loading-spinner="el-icon-loading"
    >
      <el-tree
          ref="treeRef"
          :data="dataOfTree"
          :node-key="defaultProps.value"
          :props="defaultProps"
          highlight-current
          default-expand-all
          :current-node-key="selectedNode.value"
          :expand-on-click-node="false"
          @node-click="handleNodeClicked"
          :filter-node-method="filterNode"
      >
      </el-tree>
    </el-option>

  </el-select>
</template>
<script>

export default {
  name: 'SelectTree',
  components: {},
  model: {
    prop: 'inputValue',
    event: 'myInputEvent'
  },
  props: {
    // 默认选中值
    defaultValue: {
      type: String
    },
    // 是否支持搜索，本地搜索，与远程搜索配置互斥。
    filterable: {
      type: Boolean,
      default: false
    },
    // 是否远程搜索，要设置远程搜索方法
    remote: {
      type: Boolean,
      default: false
    },
    // 远程方法
    remoteMethod: {
      type: Function
    },
    treeOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultProps: {
      type: Object,
      default: () => {
        return {
          children: 'children',
          label: 'label',
          value: 'value'
        }
      }
    }
  },
  watch: {
    treeOptions: {
      handler(newValue) {
        this.loading = false
        this.dataOfTree = JSON.parse(JSON.stringify(newValue))
        // 保留源数据；
        this.dataSource = JSON.parse(JSON.stringify(newValue))
      },
      deep: true,
      immediate: false
    },
    defaultValue: {
      handler(newValue) {
        this.selectedNode = {}
        this.currentLabel = undefined
        this.currentValue = newValue
        this.$nextTick(() => {
          // 过滤方式是通过value还是label;
          this.isFilterWithValue = true
          if (this.dataOfTree) {
            this.$refs.treeRef.filter(newValue)
          }
        })
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    // 是否支持搜索，本地搜索，与远程搜索配置互斥。
    filterableFor() {
      return this.remote ? false : this.filterable
    },
    remoteFor() {
      return this.filterable ? false : this.remote
    }
  },
  data() {
    return {
      selectedNode: {},
      loading: false,
      currentValue: undefined,
      currentLabel: undefined,
      dataOfTree: []
    }
  },
  created() {
    this.dataOfTree = JSON.parse(JSON.stringify(this.treeOptions))
    // 保留源数据；
    this.dataSource = JSON.parse(JSON.stringify(this.treeOptions))
  },
  mounted() {
  },
  methods: {
    selectRemoteMethod(val) {
      this.isFilterWithValue = false
      if (this.filterableFor) {
        // 本地过滤
        this.$refs.treeRef.filter(val)
      } else if (this.remoteFor) {
        // 远程搜索
        this.loading = true
        this.remoteMethod(val)
      }
    },
    handleClear() {
      // 如果内容被清空
      this.selectedNode = {}
      this.currentLabel = undefined
      this.currentValue = undefined
      const result = this.buildEmptyResult()
      this.$emit('myInputEvent', result)
      this.$emit('onNodeSelectEvent', result)
    },
    handleVisibleChange(visible) {
      if (!visible) {
        // 先移除所有数据；
        this.dataOfTree.splice(0)
        // 恢复原来的所有数据；
        this.dataOfTree.splice(0, 0, ...this.dataSource)
        // 本地过滤
        this.$refs.treeRef.filter('')
      }
    },
    filterNode(value, data) {
      if (!value) {
        return data
      }
      if (this.isFilterWithValue) {
        if (data[this.defaultProps.value] === value) {
          this.selectedNode = data
          this.currentLabel = data[this.defaultProps.label]
          this.$refs.treeRef.setCurrentKey(this.selectedNode[this.defaultProps.value])
          const result = this.buildResultByNodeData(data)
          this.$emit('myInputEvent', result)
        }
      } else {
        return data[this.defaultProps.label].indexOf(value) !== -1
      }
      return data
    },
    closeSelect() {
      this.$refs.selectRef.blur()
    },
    /**
     * @param data
     * @param node
     * @param comp
     */
    handleNodeClicked(data, node, comp) {
      this.selectedNode = data
      this.currentLabel = data[this.defaultProps.label]
      this.currentValue = data[this.defaultProps.value]
      const result = this.buildResultByNodeData(data)
      this.$emit('myInputEvent', result)
      this.$emit('onNodeSelectEvent', result)
      this.closeSelect()
    },
    buildResultByNodeData(data) {
      return {
        node: data[this.defaultProps.value],
        data: {
          label: data[this.defaultProps.label],
          value: data[this.defaultProps.value]
        },
        meta: data
      }
    },
    buildEmptyResult() {
      return {
        node: undefined,
        data: {
          label: undefined,
          value: undefined
        },
        meta: undefined
      }
    }
  }
}
</script>

<style scoped>
</style>
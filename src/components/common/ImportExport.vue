<template>
  <div style="display: inline-block;margin-left: 10px;">
    <a :href="exportUrl" target="_blank" style="margin-right: 10px">
      <el-button type="primary" icon="el-icon-download">导出</el-button>
    </a>
    <el-button type="primary" icon="el-icon-upload2" @click="importDialogVisible = true" v-if="hasImport">导入</el-button>
    <el-dialog :destroy-on-close="true" title="批量导入" :visible.sync="importDialogVisible">
      <div>
        <span style="margin-right: 10px;">请使用模板导入，模板为xlsx文件</span>
        <a :href="templateUrl" target="_blank">
          <el-button type="primary" icon="el-icon-download">下载模板</el-button>
        </a>
      </div>
      <div style="font-size: 15px;margin-bottom: 20px">
        <p style="color: red">注意：</p>
        <p>&nbsp;&nbsp;<span>1、请不要修改模板格式</span></p>
        <p>&nbsp;&nbsp;<span>2、请把数据放至第一个sheet页</span></p>
        <p>&nbsp;&nbsp;<span>3、模板中必填信息有：</span><span style="color: red">{{ requireFields }}</span></p>
      </div>
      <el-upload
          style="text-align: center"
          class="upload-demo"
          drag
          :action="importAction"
          :headers="headers"
          :show-file-list="false"
          :before-upload="uploadBefore"
          :on-success="uploadSuccess"
          :on-error="uploadError"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传xlsx文件，且不超过500kb</div>
      </el-upload>
      <div v-if="importResult.success || importResult.fail">
        <p>
          <span v-if="importResult.success" style="color: lawngreen;margin-right: 10px">
            成功{{ importResult.success }}条
          </span>
          <span v-if="importResult.fail" style="color: red;margin-right: 10px">
            失败{{ importResult.fail }}条
          </span>
        </p>
        <p v-for="(item,index) in importResult.errorList" :key="index">
          {{ item }}
        </p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {importRequireField} from '@/api/common';
import tokenUtil from "@/utils/tokenUtil";

export default {
  name: 'ImportExport',
  props: {
    templateCode: {
      type: String,
      default: 'NA'
    },
    params: {
      type: Object,
      default: {}
    },
    hasImport: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      exportUrl: '#',
      templateUrl: '#',
      requireFields: '',
      importAction: '',
      headers: {},
      importDialogVisible: false,
      importResult: {}
    };
  },
  created() {
    let paramsObj = this.params && {...this.params} || {};
    let paramsList = [`templateCode=${this.templateCode}`];
    Object.keys(paramsObj).forEach(key => {
      if (paramsObj[key]) {
        paramsList.push(`${key}=${paramsObj[key]}`)
      }
    });
    this.exportUrl = `/api/common/export?${paramsList.join('&')}`;
    this.templateUrl = `/api/common/template?templateCode=${this.templateCode}`;
    this.importAction = `/api/common/importFile?templateCode=${this.templateCode}`;
    this.headers = {token: tokenUtil.getToken()}
    if (this.hasImport) {
      importRequireField(this.templateCode).then(res => this.requireFields = res.join(','));
    }
  },
  methods: {
    uploadBefore(file) {
      if (!file.name.endsWith('.xlsx')) {
        this.$message.error('请上传xlsx文件');
        return false;
      }
      return true;
    },
    uploadSuccess(response, file) {
      this.$message.success(`执行成功，文件：${file.name}，请查看结果`);
      this.importResult = response.body || {};
    },
    uploadError(err) {
      let obj = typeof (err) == 'string' ? JSON.parse(err) : err;
      this.$message.error(obj.body || '系统异常');
    }
  }
};
</script>

<style scoped>

</style>

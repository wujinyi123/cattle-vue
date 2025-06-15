<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 员工档案管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="20" class="handle-el-row">
                    <el-col :span="10">
                        <span class="title">账号：</span>
                        <el-input v-model="query.username" placeholder="账号" class="handle-input mr10"></el-input>
                    </el-col>
                    <el-col :span="10">
                        <span class="title">姓名：</span>
                        <el-input v-model="query.name" placeholder="姓名" class="handle-input mr10"></el-input>
                    </el-col>
                    <el-col :span="4" style="text-align: left;">
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="handle-el-row">
                    <el-col :span="10">
                        <span class="title">工种：</span>
                        <el-input v-model="query.job" placeholder="工种" class="handle-input mr10"></el-input>
                    </el-col>
                    <el-col :span="10">
                        <span class="title">联系方式：</span>
                        <el-input v-model="query.phone" placeholder="联系方式" class="handle-input mr10"></el-input>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="handle-el-row">
                    <el-col :span="10">
                        <span class="title">是否管理员：</span>
                        <el-select v-model="query.isSysAdmin" placeholder="是否管理员" class="handle-input mr10">
                            <el-option v-for="item in isSysAdminList"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10">
                        <span class="title">状态：</span>
                        <el-select v-model="query.status" placeholder="状态" class="handle-input mr10">
                            <el-option v-for="item in userStatusList"
                            :key="item.key"
                            :label="item.value"
                            :value="item.key">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row :gutter="20" class="handle-el-row">
                    <el-col :span="24" style="text-align: left;">
                        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addUser">添加</el-button>
                        <el-button type="primary" icon="el-icon-edit" @click="updateUser">修改</el-button>
                        <el-button type="primary" icon="el-icon-refresh" @click="patchUserStatus">批量修改状态</el-button>
                        <el-button type="primary" icon="el-icon-delete" @click="resetPassword">批量重置密码</el-button>
                        <el-button type="primary" icon="el-icon-delete" @click="delUser">批量删除</el-button>
                    </el-col>
                </el-row>
            </div>
            <el-table
                :data="tableData"
                current-row-key="id"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="username" label="账号"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="job" label="工种"></el-table-column>
                <el-table-column prop="phone" label="联系方式"></el-table-column>
                <el-table-column prop="isSysAdminValue" label="是否系统管理员"></el-table-column>
                <el-table-column prop="statusValue" label="状态"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="sizes, total, prev, pager, next"
                    :current-page="query.pageNum"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @size-change="handleSizeChange"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
        <el-dialog :title="saveDialog.title" :visible.sync="saveDialog.visible">
            <el-form :model="saveDialog.form">
                <el-form-item label="账号" :label-width="formLabelWidth">
                    <el-input v-model="saveDialog.form.username" :disabled="saveDialog.title=='修改'" autocomplete="off" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="saveDialog.form.name" autocomplete="off" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="工种" :label-width="formLabelWidth">
                    <el-input v-model="saveDialog.form.job" autocomplete="off" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth">
                    <el-input v-model="saveDialog.form.phone" autocomplete="off" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="是否管理员" :label-width="formLabelWidth">
                    <el-select v-model="saveDialog.form.isSysAdmin" class="handle-input">
                        <el-option v-for="item in isSysAdminList"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-select v-model="saveDialog.form.status" class="handle-input">
                        <el-option v-for="item in userStatusList"
                        :key="item.key"
                        :label="item.value"
                        :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="saveDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="saveUser">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="批量修改状态" :visible.sync="setUserStatusDialog.visible">
            <el-form :model="setUserStatusDialog.form">
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-radio-group v-model="setUserStatusDialog.form.value">
                        <el-radio v-for="item in userStatusList"
                        :key="item.key"
                        :label="item.key">
                            {{item.value}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setUserStatusDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="setUserStatus">保 存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import {pageUser, getUser, saveUser, setUserStatus, resetPassword, delUser} from '@/api/user';
import configValue from '@/components/common/configValue';

export default {
    name: 'employeeInfoManage',
    data() {
        return {
            isSysAdminList:[],
            userStatusList:[],
            query: {
                username: '',
                name: '',
                job:'',
                phone:'',
                isSysAdmin:'',
                status:'incumbent',
                pageNum: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            pageTotal: 0,
            idx: -1,
            id: -1,
            formLabelWidth:'120px',
            saveDialog:{
                title:'',
                visible:false,
                form: {
                    username: '',
                    name: '',
                    job:'',
                    phone:'',
                    isSysAdmin:'N',
                    status:'incumbent'
                }
            },
            setUserStatusDialog:{
                visible:false,
                form:{
                    value:''
                }
            }
        };
    },
    created() {
        this.isSysAdminList=configValue.whetherOrNot;
        this.userStatusList=configValue.userStatus;
        this.getData();
    },
    methods: {
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleSizeChange(val) {
            this.$set(this.query, 'pageSize', val);
            this.getData();
        },
        handlePageChange(val) {
            this.$set(this.query, 'pageNum', val);
            this.getData();
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            pageUser(this.query).then(res => {
                let userStatusMap = {};
                this.userStatusList.forEach(item=>userStatusMap[item.key]=item.value);
                let isSysAdminMap = {};
                this.isSysAdminList.forEach(item=>isSysAdminMap[item.key]=item.value);
                res.list.forEach(item=>item.isSysAdminValue=isSysAdminMap[item.isSysAdmin]);
                res.list.forEach(item=>item.statusValue=userStatusMap[item.status]);
                this.tableData = res.list;
                this.pageTotal = res.total;
                this.multipleSelection = [];
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageNum', 1);
            this.getData();
        },
        addUser() {
            this.saveDialog.title='新增';
            this.saveDialog.form.username='';
            this.saveDialog.form.name='';
            this.saveDialog.form.job='';
            this.saveDialog.form.phone='';
            this.saveDialog.form.isSysAdmin='N';
            this.saveDialog.form.status='incumbent';
            this.saveDialog.visible=true;
        },
        updateUser() {
            if (this.multipleSelection.length!=1) {
                this.$message.error('仅请选择一条数据');
                return;
            }
            this.saveDialog.title='修改';
            getUser(this.multipleSelection[0].username).then(res=>{
                this.saveDialog.form.username=res.username;
                this.saveDialog.form.name=res.name;
                this.saveDialog.form.job=res.job;
                this.saveDialog.form.phone=res.phone;
                this.saveDialog.form.isSysAdmin=res.isSysAdmin;
                this.saveDialog.form.status=res.status;
            });
            this.saveDialog.visible=true;
        },
        saveUser() {
            let type = this.saveDialog.title=='新增'?'add':'update';
            saveUser(type, this.saveDialog.form).then(res=>{
                if (res>0) {
                    this.saveDialog.visible=false;
                    this.$message.success('保存成功');
                    this.getData();
                } else {
                    this.$message.error('保存失败');
                }
            });
        },
        patchUserStatus() {
            if (this.multipleSelection.length==0) {
                this.$message.error('至少选择一条数据');
                return;
            }
            this.setUserStatusDialog.visible=true;
        },
        setUserStatus() {
            if (!this.setUserStatusDialog.form.value) {
                this.$message.error('请选择状态');
                return;
            }
            setUserStatus(this.setUserStatusDialog.form.value,this.multipleSelection.map(item=>item.username)).then(res=>{
                if (res>0) {
                    this.setUserStatusDialog.visible=false;
                    this.$message.success('修改成功');
                    this.getData();
                } else {
                    this.$message.error('修改失败');
                }
            });
        },
        resetPassword() {
            if (this.multipleSelection.length==0) {
                this.$message.error('至少选择一条数据');
                return;
            }
            this.$confirm('此操作将重置用户密码, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                resetPassword(this.multipleSelection.map(item=>item.username)).then(res=>{
                    if (res>0) {
                        this.$message.success('重置密码成功');
                        this.getData();
                    } else {
                        this.$message.error('重置密码失败');
                    }
                });
            });
        },
        delUser() {
            if (this.multipleSelection.length==0) {
                this.$message.error('至少选择一条数据');
                return;
            }
            this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delUser(this.multipleSelection.map(item=>item.username)).then(res=>{
                    if (res>0) {
                        this.$message.success('删除成功');
                        this.getData();
                    } else {
                        this.$message.error('删除失败');
                    }
                });
            });
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-el-row {
    margin: 10px 0;
    text-align: center;
}

.handle-el-row .title {
    width: 40%;
    text-align: right;
}

.handle-input {
    display: inline-block;
    width: 60%;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>

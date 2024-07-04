<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :changePage="changePage" :editFunc="handleEdit" :refresh="refreshTable"
                :current-page="page.index" :page-size="page.size" rowKey="circleId">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
                    <el-button type="primary" :icon="Search" @click="visibleFind = true">多条件查询</el-button>
                </template>
                <template #status="{ rows }">
                    <el-tag type="success" v-if="rows.circleStatus">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
                <template #permissions="{ rows }">
                    <el-button type="primary" size="small" plain @click="handlePermission(rows)">管理</el-button>
                </template>
            </TableCustom>
        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :formData="rowData" :options="options" :edit="isEdit" :update="updateData"
                :add="addCircle" />
        </el-dialog>
        <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
            <TableDetail :data="viewData">
                <template #circleStatus="{ rows }">
                    <el-tag type="success" v-if="rows.circleStatus === 0">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
                <template #isDelete="{ rows }">
                    <el-tag type="success" v-if="rows.isDelete === 0">未删除</el-tag>
                    <el-tag type="danger" v-else>已删除</el-tag>
                </template>
            </TableDetail>
        </el-dialog>
        <!-- <el-dialog title="多条件查询" v-model="visibleFind" width="700px" destroy-on-close :close-on-click-modal="false"
            @close="closeDialogFind">
            <TableEdit :options="optionsFind" :search="getCircle" :searchSignal="true" />
        </el-dialog> -->
        <!-- 多条件查询弹窗组件 -->
        <el-dialog title="查询条件" v-model="visibleFind" width="30%">
            <el-form :model="request" ref="formAddRef">
                <el-form-item label="圈子名称" :label-width="formLabelWidth">
                    <el-input v-model="request.circleName" placeholder="请输入圈子名称"></el-input>
                </el-form-item>
                <el-form-item label="是否禁用" :label-width="formLabelWidth">
                    <el-select v-model="request.CircleStatus" placeholder="请选择状态">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="正常" value="0"></el-option>
                        <el-option label="禁用" value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否删除" :label-width="formLabelWidth">
                    <el-select v-model="request.isDelete" placeholder="请选择是否删除">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未删除" value="0"></el-option>
                        <el-option label="已删除" value="1"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="resetForm()">清空</el-button>
                    <el-button type="primary" @click="getCircle">
                        查询
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="dashboard">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Request_circle, Request_circle_add, Request_circle_delete, Request_circle_detail, Record, Request_circle_update, Response_circle, Response_circle_detail, Data, Data_circle_detail } from '@/types/circle';
// import { fetchRoleData } from '@/api';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
// import RolePermission from './role-permission.vue'
import { CirclePlusFilled, Search } from '@element-plus/icons-vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import { deleteCircleAPI, getCircleAPI, getOneCircleAPI, addCircleAPI, updateCircleAPI } from '@/api/circle';
const formLabelWidth = ref('100px');
const visibleFind = ref(false);

// 查询相关
const query = reactive({
    circleId: '',
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '圈子ID：', prop: 'circleId' },
]);

const handleSearch = () => {
    resetForm();
    handGetOneCircle();
};
const handGetOneCircle = async () => {
    console.log(query.circleId);
    
    if (query.circleId === '') {
        
        getCircle();
        return;
    }
    // const circleIdInt = parseInt(query.circleId);
    const res = await getOneCircle(query);
    if (!res) {
        ElMessage.error('圈子ID不存在');
        return;
    }
    tableData.value = [res];
    page.total = 1;
}
// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'circleId', label: '圈子ID' },
    { prop: 'circleName', label: '圈子名称' },
    { prop: 'circleDescription', label: '圈子描述' },
    { prop: 'circleAvatar', label: '头像链接' },
    { prop: 'circleBackground', label: '背景描述' },
    { prop: 'circleType', label: '圈子类型' },
    { prop: 'circleCreateTime', label: '创建时间' },
    { prop: 'circleUpdateTime', label: '更新时间' },
    { prop: 'circleUserCount', label: '用户数' },
    { prop: 'circlePostCount', label: '帖子数' },
    { prop: 'isDelete', label: '是否删除' },
    { prop: 'circleStatus', label: '状态' },
    { prop: 'operator', label: '操作', width: 250 },
]);
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
});
const tableData = ref<Record[]>([]);
// const getData = async () => {
//     try {
//         const res = await fetchRoleData();
//         tableData.value = res.data.list;
//         page.total = res.data.pageTotal;
//     } catch (error) {
//         console.error(error);
//     }
// };
// getData();
const changePage = (val: number) => {
    page.index = val;
    getCircle();
    // getData();
};

// 新增/编辑弹窗相关
const options = ref<FormOption>({
    labelWidth: '100px',
    span: 24,
    list: [
        { type: 'input', label: '圈子名称', prop: 'circleName', required: true },
        { type: 'input', label: '圈子描述', prop: 'circleDescription', required: true },
        { type: 'upload', label: '圈子头像', prop: 'circleAvatar', required: true },
        { type: 'input', label: '圈子背景', prop: 'circleBackground', required: true },
        { type: 'input', label: '圈子类型', prop: 'circleType', required: true },
        { type: 'switch', label: '状态', prop: 'circleStatus', required: true, activeText: '启用', inactiveText: '禁用', activeValue: 0, inactiveValue: 1 },
        { type: 'switch', label: '是否删除', prop: 'isDelete', required: true, activeText: '未删除', inactiveText: '已删除', activeValue: 0, inactiveValue: 1 },
    ]
});
const visible = ref(false);
const isEdit = ref(false);
const rowData: Request_circle_update = ref({});
const handleEdit = async (row: Request_circle_update) => {
    try {
        // const res = await getOneCircle(row.circleId);
        console.log(row)
        isEdit.value = true;
        visible.value = true;
        rowData.value = { ...row };
        console.log(rowData.value)
    } catch (error) {
        console.error(error);
    }
};
const updateData = async (Data) => {
    updateCircle(Data);
    closeDialog();
};
const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
    rowData.value = {};
};
const updateCircle = async (Data) => {
    try {
        const res = await updateCircleAPI(Data);
        console.log(rowData.value);
        if (res.code === 1) {
            ElMessage.success('修改成功');
            visible.value = false;
            isEdit.value = false;
            rowData.value = {};
            getCircle();
            // getData();
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('修改失败');
    }
};
// 查看详情弹窗相关
const visible1 = ref(false);
const viewData = ref({
    row: {},
    list: [],
    column: 1
});
const handleView = async (row: Request_circle) => {
    try {
        // const res = await getOneCircle(row.circleId);
        viewData.value.row = { ...row };
        viewData.value.list = [
            {
                prop: 'circleId',
                label: '圈子ID',
            },
            {
                prop: 'circleName',
                label: '圈子名称',
            },
            {
                prop: 'circleDescription',
                label: '圈子描述',
            },
            {
                prop: 'circleAvatar',
                label: '头像链接',
            },
            {
                prop: 'circleBackground',
                label: '背景描述',
            },
            {
                prop: 'circleType',
                label: '圈子类型',
            },
            {
                prop: 'circleCreateTime',
                label: '创建时间',
            },
            {
                prop: 'circleUpdateTime',
                label: '更新时间',
            },
            {
                prop: 'circleUserCount',
                label: '用户数',
            },
            {
                prop: 'circlePostCount',
                label: '帖子数',
            },
            {
                prop: 'isDelete',
                label: '是否删除',
            },
            {
                prop: 'circleStatus',
                label: '状态',
            },
        ];
        visible1.value = true;
    } catch (error) {
        console.error(error);
    }
};

// 删除相关
const handleDelete = async (row: Request_circle_delete) => {

    try {
        const res = await deleteCircleAPI(row);
        if (res.code === 1) {
            ElMessage.success('删除成功');
            getCircle();
            // getData();
        } else {
            ElMessage.error('删除失败');
        }
    } catch (error) {
        ElMessage.error('删除失败');
    }

};

// 权限管理弹窗相关
const visible2 = ref(false);
const permissOptions = ref({});
const handlePermission = (row: Role) => {
    visible2.value = true;
    permissOptions.value = {
        id: row.circleId,
        permiss: row.permiss
    };
}
const request: Request_circle = reactive({
    p: '1',
    s: '10',
    circleName: "",
    CircleStatus: "",
    isDelete: "",
})

// const searchData: Request_circle = reactive({
//     p: '1',
//     s: '10',
//     circleName: "",
//     CircleStatus: "",
//     isDelete: "",
// })

const resetForm = () => {
    request.circleName = '';
    request.isDelete = '';
    request.CircleStatus = '';
}
const getCircle = async () => {
    // if((searchData.circleName!=='')&&(searchData.CircleStatus!=='')&&(searchData.isDelete!=='')){
    //     request.CircleStatus=

    // }
    request.p = page.index + '';
    try {
        const res = await getCircleAPI(request)
        if (res.code === 1) {
            const { records, total } = res.data;
            visibleFind.value=false;
            tableData.value = records;
            page.total = total;
        } else {
            ElMessage.error(res.msg)
        }

    } catch (error) {
        console.log(error)
    }

}
getCircle();

//回调，获取单个圈子信息
const getOneCircle = async (Data) => {
    try {
        const res = await getOneCircleAPI(Data);
        if (res.code == 1) {
            console.log(res.data);
            return res.data;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error(error);
    }

};

// 定义刷新方法
const refreshTable = () => {
    handGetOneCircle();
    localStorage.setItem('selectedCircle', JSON.stringify({ circleId: '', circleName: '' }));
};
// 新增圈子
const addCircle = async (form_add) => {
    try {
        const res = await addCircleAPI(form_add);
        if (res.code == 1) {
            ElMessage.success('新增成功');
            getCircle();
            visible.value=false;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('新增失败');
    }

}
</script>

<style scoped></style>
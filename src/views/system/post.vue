<template>
    <div>
        <TableSearch :query="query" :options="searchOpt" :search="handleSearch" :clear="resetForm" />
        <div class="container">
            <TableCustom :columns="columns" :tableData="tableData" :total="page.total" :viewFunc="handleView"
                :delFunc="handleDelete" :changePage="changePage" :editFunc="handleEdit" :refresh="refreshTable"
                :current-page="page.index" :page-size="page.size" rowKey="postId">
                <template #toolbarBtn>
                    <el-button type="warning" :icon="CirclePlusFilled" @click="visible = true">新增</el-button>
                    <el-button type="primary" :icon="Search" @click="visibleFind = true">多条件查询</el-button>
                </template>
                <template #status="{ rows }">
                    <el-tag type="success" v-if="rows.status">启用</el-tag>
                    <el-tag type="danger" v-else>禁用</el-tag>
                </template>
                <template #permissions="{ rows }">
                    <el-button type="primary" size="small" plain @click="handlePermission(rows)">管理</el-button>
                </template>
            </TableCustom>
        </div>
        <el-dialog :title="isEdit ? '编辑' : '新增'" v-model="visible" width="700px" destroy-on-close
            :close-on-click-modal="false" @close="closeDialog">
            <TableEdit :formData="rowData" :options="options" :edit="isEdit" :update="updateData" :add="addPost" />
        </el-dialog>
        <el-dialog title="查看详情" v-model="visible1" width="700px" destroy-on-close>
            <TableDetail :data="viewData">
                <template #isDelete="{ rows }">
                    <el-tag type="success" v-if="rows.isDelete===0">未删除</el-tag>
                    <el-tag type="danger" v-else>已删除</el-tag>
                </template>
            </TableDetail>
        </el-dialog>
    <!-- 多条件查询弹窗组件 -->
    <el-dialog title="查询条件" v-model="visibleFind" width="30%">
            <el-form :model="query" ref="queryForm">
                <el-form-item label="帖子ID" :label-width="formLabelWidth">
                    <el-input class="custom-input" v-model="query.postId" placeholder="请输入帖子ID"></el-input>
                </el-form-item>
                <el-form-item label="帖子标题" :label-width="formLabelWidth">
                    <el-input class="custom-input" v-model="query.postTitle" placeholder="请输入帖子标题"></el-input>
                </el-form-item>
                <el-form-item label="分组ID" :label-width="formLabelWidth">
                    <el-input class="custom-input" v-model="query.groupId" placeholder="请输入分组ID"></el-input>
                </el-form-item>
                <el-form-item label="话题ID" :label-width="formLabelWidth">
                    <el-input class="custom-input" v-model="query.topicId" placeholder="请输入话题ID"></el-input>
                </el-form-item>
                <el-form-item label="话题名" :label-width="formLabelWidth">
                    <el-input class="custom-input" v-model="query.topicName" placeholder="请输入话题名"></el-input>
                </el-form-item>
                <el-form-item label="用户ID" :label-width="formLabelWidth">
                    <el-input class="custom-input" v-model="query.userId" placeholder="请输入用户ID"></el-input>
                </el-form-item>
                <el-form-item label="是否删除" :label-width="formLabelWidth">
                    <el-select v-model="query.isDelete" placeholder="请选择是否删除">
                        <el-option label="全部" value=""></el-option>
                        <el-option label="未删除" value="0"></el-option>
                        <el-option label="已删除" value="1"></el-option>
                    </el-select>
                </el-form-item>

                <!-- 其他字段表单项... -->
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="resetForm()">清空</el-button>
                    <el-button type="primary" @click="handleFind()">
                        查询
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts" name="post">
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Request_post, Response_post, Data as PostData, Record as PostRecord, Request_post_detail, Response_post_detail, Data_post_detail, Request_post_add, Request_post_update, Request_post_delete } from '@/types/post';
import TableCustom from '@/components/table-custom.vue';
import TableDetail from '@/components/table-detail.vue';
import { CirclePlusFilled ,Search} from '@element-plus/icons-vue';
import { FormOption, FormOptionList } from '@/types/form-option';
import { deletePostAPI, getPostAPI, getOnePostAPI, addPostAPI, updatePostAPI } from '@/api/post';
const formLabelWidth = '100px';
const visibleFind = ref(false);
// 获取localStorage中的'selectedCircle'项
const selectedCircleStorage = localStorage.getItem('selectedCircle');
const selectedCircle = JSON.parse(selectedCircleStorage);
// 查询相关
const query:Request_post = reactive({
    postId: '',
    postTitle: '',
    p: '1',
    s: '10',
    isDelete: "",
    circleId: selectedCircle.circleId
});
const searchOpt = ref<FormOptionList[]>([
    { type: 'input', label: '帖子ID：', prop: 'postId' },
    { type: 'input', label: '帖子标题：', prop: 'postTitle' }
]);

const handleSearch = () => {
    handGetOnePost();
};
const handGetOnePost = async () => {
    console.log(query.postId);
    console.log(query.postTitle);
    if (query.postId === '' && query.postTitle === '') {
        getPosts();
        return;
    }
    const res = await getPostAPI(query);
    if (res.code === 1) {
            const { records, total } = res.data;
            resetForm();
            tableData.value = records;
            page.total = total;
        } else {
            ElMessage.error(res.msg)
        }
}

// 表格相关
let columns = ref([
    { type: 'index', label: '序号', width: 55, align: 'center' },
    { prop: 'postId', label: '帖子ID' },
    { prop: 'circleId', label: '圈子ID' },
    { prop: 'userId', label: '用户ID' },
    { prop: 'postTitle', label: '帖子标题' },
    { prop: 'postContent', label: '帖子内容' },
    { prop: 'postLikeCount', label: '帖子点赞数' },
    { prop: 'postCommentCount', label: '帖子评论数' },
    { prop: 'postImgUrls', label: '帖子图片' },
    { prop: 'isDelete', label: '是否删除' },
    { prop: 'postUpdateTime', label: '帖子更新时间' },
    { prop: 'postCreateTime', label: '帖子创建时间' },
    { prop: 'groupId', label: '分组ID' },
    { prop: 'topicId', label: '话题ID' },
    { prop: 'operator', label: '操作', width: 250 },
]);
const page = reactive({
    index: 1,
    size: 10,
    total: 0,
});
const tableData = ref<PostRecord[]>([]);

const changePage = (val: number) => {
    page.index = val;
    getPosts();
};

// 新增/编辑弹窗相关
const options = ref<FormOption>({
    labelWidth: '100px',
    span: 24,
    list: [
        { type: 'input', label: '帖子标题', prop: 'postTitle', required: true },
        { type: 'textarea', label: '帖子内容', prop: 'postContent', required: true },
        { type: 'upload', label: '帖子图片', prop: 'postImgUrls', required: true },
        { type: 'input', label: '分组ID', prop: 'groupId', required: true },
        { type: 'input', label: '用户ID', prop: 'userId', required: true },
        { type: 'input', label: '所属话题', prop: 'topicName', required: true },
        
    ]
});
const visible = ref(false);
const isEdit = ref(false);
const rowData: Request_post_update = ref({});
const handleEdit = async (row: Request_post_update) => {
    try {
        // const res = await getOnePost(row.postId);
        isEdit.value = true;
        visible.value = true;
        rowData.value = { ...row };
    } catch (error) {
        console.error(error);
    }
};
const updateData = async (data) => {
    updatePost(data);
    closeDialog();
};
const closeDialog = () => {
    visible.value = false;
    isEdit.value = false;
    rowData.value = {};
};
const updatePost = async (data) => {
    try {
        const res = await updatePostAPI(data);
        if (res.code === 1) {
            ElMessage.success('修改成功');
            visible.value = false;
            isEdit.value = false;
            rowData.value = {};
            getPosts();
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
const handleView = async (row: Request_post) => {
    try {
        // const res = await getOnePost(row.postId);
        viewData.value.row = { ...row };
        viewData.value.list = [
            {
                prop: 'postId',
                label: '帖子ID',
            },
            {
                prop: 'postTitle',
                label: '帖子标题',
            },
            {
                prop: 'postContent',
                label: '帖子内容',
            },
            {
                prop: 'postCreateTime',
                label: '创建时间',
            },
            {
                prop: 'postUpdateTime',
                label: '更新时间',
            },
            {
                prop: 'postLikeCount',
                label: '点赞数',
            },
            {
                prop: 'postCommentCount',
                label: '评论数',
            },
            {
                prop: 'isDelete',
                label: '是否删除',
            },
        ];
        visible1.value = true;
    } catch (error) {
        console.error(error);
    }
};

// 删除相关
const handleDelete = async (row: Request_post_delete) => {
    try {
        const res = await deletePostAPI(row);
        if (res.code === 1) {
            ElMessage.success('删除成功');
            getPosts();
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
const handlePermission = (row) => {
    visible2.value = true;
    permissOptions.value = {
        id: row.postId
    };
}

// const request: Request_post = reactive({
//     p: '1',
//     s: '10',
//     postTitle: "",
//     userId: null,
//     topicId: null,
//     postId: null,
//     isDelete: "",
//     circleId: selectedCircle.circleId
// });

const resetForm = () => {
    query.groupId = null;
    query.topicId = null;
    query.circleName = "";
    query.topicName = "";
    query.postId = null;
    query.postTitle = "";
    query.userId = null;
    query.isDelete = "";
}
const getPosts = async () => {
    query.p = page.index + '';
    try {
        const res = await getPostAPI(query);
        if (res.code === 1) {
            const { records, total } = res.data;
            tableData.value = records;
            page.total = total;
            visibleFind.value = false;
        } else {
            ElMessage.error(res.msg)
        }
    } catch (error) {
        console.log(error)
    }
}
getPosts(); 
const handleFind = () => {
    page.index = 1;
    getPosts();
}
// 回调，获取单个帖子信息
const getOnePost = async (data) => {
    try {
        const res = await getOnePostAPI(data);
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
    handGetOnePost();
};

// 新增帖子
const addPost = async (form_add) => {
    try {
        const res = await addPostAPI(form_add);
        if (res.code == 1) {
            ElMessage.success('新增成功');
            getPosts();
            visible.value = false;
        } else {
            ElMessage.error(res.msg);
        }
    } catch (error) {
        ElMessage.error('新增失败');
    }
}
</script>

<style scoped></style>
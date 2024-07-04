<template>
    <div>
        <div class="table-toolbar" v-if="hasToolbar">
            <div class="table-toolbar-left">
                <slot name="toolbarBtn"></slot>
            </div>
            <div class="table-toolbar-right flex-center">
                <template v-if="multipleSelection.length > 0">
                    <el-tooltip effect="dark" content="删除选中" placement="top">
                        <el-icon class="columns-setting-icon" @click="delSelection(multipleSelection)">
                            <Delete />
                        </el-icon>
                    </el-tooltip>
                    <el-divider direction="vertical" />
                </template>
                <el-tooltip effect="dark" content="刷新" placement="top">
                    <el-icon class="columns-setting-icon" @click="refresh01">
                        <Refresh />
                    </el-icon>
                </el-tooltip>
                <el-divider direction="vertical" />
                <el-tooltip effect="dark" content="列设置" placement="top">
                    <el-dropdown :hide-on-click="false" size="small" trigger="click">
                        <el-icon class="columns-setting-icon">
                            <Setting />
                        </el-icon>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item v-for="c in columns" :key="c.prop">
                                    <el-checkbox v-model="c.visible" :label="c.label" />
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </el-tooltip>
            </div>
        </div>
        <el-table class="mgb20" :style="{ width: '100%' }" border :data="tableData" :row-key="rowKey"
            highlight-current-row ref='table' @current-change="handleRowClick" @selection-change="handleSelectionChange"
            table-layout="auto" :tableKey="tableKey">
            <template v-if="tableKey === 'deleteSelect'">
                <el-table-column type="selection" width="55" />
            </template>
            <template v-for="item in columns" :key="item.prop">
                <el-table-column v-if="item.visible" :prop="item.prop" :label="item.label" :width="item.width"
                    :type="item.type" :align="item.align || 'center'">

                    <template #default="{ row, column, $index }" v-if="item.type === 'index'">
                        {{ getIndex($index) }}
                    </template>

                    <template #default="{ row, column, $index }">
                        <!-- 直接渲染图片，基于假设 item.prop 指向图片地址 -->
                        <img v-if="item.prop === 'circleAvatar' || item.prop === 'postImgUrls'" :src="row[item.prop]"
                            alt="Image" style="width: 50px;" />
                        <template v-else-if="item.prop === 'circleStatus'">
                            <el-tag :type="row[item.prop] === 0 ? 'success' : 'danger'">{{ row[item.prop] === 0 ? '正常' : '禁用' }}</el-tag>
                        </template>
                        <template v-else-if="item.prop === 'isDelete'|| item.prop === 'isDeleted'">
                            <el-tag :type="row[item.prop] === 0 ? 'success' : 'danger'">{{ row[item.prop] === 0 ? '未删除' : '已删除' }}</el-tag>
                        </template>
                        <!-- 其他逻辑保持不变，比如对于 operator 的处理 -->
                        <template v-else-if="item.prop === 'operator'">
                            <el-button type="warning" size="small" :icon="View" @click="viewFunc(row)">
                                查看
                            </el-button>
                            <template v-if="rowKey !== 'commentId'">
                            <el-button type="primary" size="small" :icon="Edit" @click="editFunc(row)">
                                编辑
                            </el-button>
                        </template>
                        <template v-if="rowKey === 'commentId'">
                            <el-button type="primary" size="small" :icon="View" @click="checkRely(row)">
                                查看回复
                            </el-button>
                        </template>
                            <el-button type="danger" size="small" :icon="Delete" @click="handleDelete(row)">
                                删除
                            </el-button>
                        </template>

                        <!-- 对于有formatter的情况和默认情况 -->
                        <span v-else-if="item.formatter">
                            {{ item.formatter(row[item.prop]) }}
                        </span>
                        <span v-else>
                            {{ row[item.prop] }}
                        </span>
                    </template>
                </el-table-column>
            </template>
        </el-table>
        <el-pagination v-if="hasPagination" :current-page="currentPage" :page-size="pageSize" :background="true"
            :layout="layout" :total="total" @current-change="handleCurrentChange" />
    </div>
</template>

<script setup lang="ts">
import { toRefs, PropType, ref, onMounted } from 'vue'
import { Delete, Edit, View, Refresh } from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox, ElTable } from 'element-plus';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
    // 表格相关
    tableData: {
        type: Array,
        default: []
    },
    columns: {
        type: Array as PropType<any[]>,
        default: []
    },
    rowKey: {
        type: String,
        default: 'id'
    },
    hasToolbar: {
        type: Boolean,
        default: true
    },
    //  分页相关
    hasPagination: {
        type: Boolean,
        default: true
    },
    total: {
        type: Number,
        default: 0
    },
    currentPage: {
        type: Number,
        default: 1
    },
    pageSize: {
        type: Number,
        default: 10
    },

    layout: {
        type: String,
        default: 'total, prev, pager, next'
    },
    delFunc: {
        type: Function,
        default: () => { }
    },
    viewFunc: {
        type: Function,
        default: () => { }
    },
    editFunc: {
        type: Function,
        default: () => { }
    },
    delSelection: {
        type: Function,
        default: () => { }
    },
    refresh: {
        type: Function,
        default: () => { }
    },
    changePage: {
        type: Function,
        default: () => { }
    },
    tableKey: {
        type: String,
        default: ''
    }
})

let {
    tableData,
    columns,
    rowKey,
    hasToolbar,
    hasPagination,
    total,
    currentPage,
    pageSize,
    layout,
    tableKey
} = toRefs(props)

columns.value.forEach((item) => {
    if (item.visible === undefined) {
        item.visible = true
    }
})
// 当选择项发生变化时会触发该事件
const multipleSelection = ref([])
const handleSelectionChange = (selection: any[]) => {
    console.log(selection);
    if (rowKey.value === 'groupId') {
        const groupIds = selection.map(item => item.groupId);
        console.log(groupIds);
        multipleSelection.value = groupIds;
    }else if (rowKey.value === 'commentId') {
        const postCommentId = selection.map(item => item.postCommentId);
        console.log(postCommentId);
        multipleSelection.value = postCommentId;
    }else if (rowKey.value === 'postReplyId') {
        const postReplyId = selection.map(item => item.postReplyId);
        console.log(postReplyId);
        multipleSelection.value = postReplyId;
    }
    console.log(multipleSelection.value);
}

// 当前页码变化的事件
const handleCurrentChange = (val: number) => {
    props.changePage(val)
}

const handleDelete = (row) => {
    ElMessageBox.confirm('确定要删除吗？', '提示', {
        type: 'warning'
    })
        .then(async () => {
            props.delFunc(row);
        })
        .catch(() => { });
};

const getIndex = (index: number) => {
    return index + 1 + (currentPage.value - 1) * pageSize.value
}


// 新增currentRow和currentRowKey来管理选中行
const currentRow = ref(null);
const currentRowKey = ref(null);
const table = ref<InstanceType<typeof ElTable>>()
// 处理行点击事件，将选中行数据存入localStorage
function handleRowClick(row) {
    if (rowKey.value === 'circleId') {

        if (row) {
            localStorage.setItem('selectedCircle', JSON.stringify({ circleId: row.circleId, circleName: row.circleName }));
        }
        else {
            localStorage.setItem('selectedCircle', JSON.stringify({ circleId: '', circleName: '' }));
        }
        table.value!.setCurrentRow(row) // 高亮当前行
    }



    // if (row) {
    //     currentRow.value = row;
    //     currentRowKey.value = row[rowKey.value];
    //     if (rowKey.value === 'circleId') {
    //         localStorage.setItem('selectedCircle', JSON.stringify({ circleId: row.circleId, circleName: row.circleName }));
    //     }
    // }
};

// 默认选择第一行
// onMounted(() => {
// if (tableData.value && tableData.value.length > 0) {
//     const firstRow = tableData.value[0];
//     handleRowClick(firstRow);
// }
if (rowKey.value === 'circleId') {
    localStorage.setItem('selectedCircle', JSON.stringify({ circleId: '', circleName: '' }));
    localStorage.setItem('postId', '');
}
if (rowKey.value === 'commentId') {
    localStorage.setItem('postCommentId', '');
}
// localStorage.setItem('circleId', '');
// });
// 处理刷新操作，取消选中效果
const refresh01 = () => {
    ElMessage.success('刷新成功');
    handleRowClick(null);
    props.refresh();

}

const checkRely = (row) => {
    localStorage.setItem('postCommentId', row.postCommentId);
    router.push('/system-relyComment');
}
</script>

<style scoped>
.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 10px;
}

.columns-setting-icon {
    display: block;
    font-size: 18px;
    cursor: pointer;
    color: #676767;
}

.table-header .cell {
    color: #333;
}
</style>
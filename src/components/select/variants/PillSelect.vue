<template>
  <div class="select-pill" :class="[`size-${size}`, { disabled }]">
    <!-- 베이스를 내부에서 재사용. 외곽선/배경은 컨테이너가 담당 -->
    <BaseSelect
      class="control"
      v-model="inner"
      :options="options"
      :placeholder="placeholder"
      :name="name"
      :required="required"
      :disabled="disabled"
      size="md"
      v-bind="$attrs"
    />
    <span class="arrow" aria-hidden="true"></span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseSelect from '../BaseSelect.vue'

/**
 * @component SelectPill
 * @description
 * 알약(pill) 형태의 외곽선/배경을 가진 셀렉트 컴포넌트.  
 * - 내부적으로 `BaseSelect`를 사용하고, 컨테이너에서 스타일(테두리/라운드/포커스 링)을 담당합니다.  
 * - `size` 프리셋으로 높이 조절(sm/md/lg).  
 * - `options`는 문자열 배열 또는 `{label, value}` 배열 모두 지원.
 *
 * @example
 * <!-- 기본 사용 -->
 * <SelectPill v-model="value" :options="['All','Open','Closed']" />
 *
 * <!-- 객체 옵션 + placeholder -->
 * <SelectPill
 *   v-model="country"
 *   placeholder="국가 선택"
 *   :options="[{label:'한국',value:'KR'},{label:'미국',value:'US'}]"
 *   size="lg"
 * />
 *
 * <!-- 비활성화 -->
 * <SelectPill v-model="v" :options="opts" disabled />
 */

/**
 * @typedef {Object} SelectPillProps
 * @property {string|number|null} [modelValue=''] - 선택된 값 (v-model)
 * @property {Array<string|{label:string,value:any}>} [options=[]] - 옵션 목록
 * @property {string} [placeholder=''] - placeholder 텍스트
 * @property {string} [name=''] - 네이티브 name
 * @property {boolean} [required=false] - 필수 여부
 * @property {boolean} [disabled=false] - 비활성화 여부
 * @property {'sm'|'md'|'lg'} [size='md'] - 컨테이너 높이 프리셋
 */
const props = defineProps({
  modelValue: { type: [String, Number, null], default: '' },
  options: { type: Array, default: () => [] },
  placeholder: { type: String, default: '' },
  name: { type: String, default: '' },
  required: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  /** sm | md | lg */
  size: { type: String, default: 'md' },
})

/**
 * @event update:modelValue - 선택 값 변경 시 발생
 * @event change - (BaseSelect로 위임) 네이티브 change 이후 발생
 */
const emit = defineEmits(['update:modelValue', 'change'])

/** v-model 포워딩용 계산 속성 */
const inner = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<style scoped>
.select-pill{
  display:inline-flex;
  align-items:center;
  position:relative;
  border:1px solid #cfd4dc;
  border-radius:999px;
  background:#fff;
  /* 컨테이너 패딩으로 pill 느낌 */
  padding: 0 12px;
}
.select-pill.size-sm{ height:32px; }
.select-pill.size-md{ height:38px; }
.select-pill.size-lg{ height:44px; }

.select-pill:focus-within{
  box-shadow:0 0 0 3px rgba(59,130,246,.25);
  border-color:#93c5fd;
}

/* 내부 select는 테두리/배경 제거하고 텍스트만 표시 */
.control{
  appearance:none;
  -webkit-appearance:none;
  border:0;
  background:transparent;
  padding:0;
  margin:0;
  outline:none;
  color:#111827;
  font: inherit;
  /* 화살표 공간 */
  padding-right:20px;
}

/* 회색 아래쪽 삼각형 화살표 */
.arrow{
  position:absolute;
  right:10px; top:50%;
  transform:translateY(-35%); /* 살짝 위로 */
  width:0; height:0;
  border-left:6px solid transparent;
  border-right:6px solid transparent;
  border-top:7px solid #9093a0; /* 회색 */
  pointer-events:none;
}

.disabled{ background:#f9fafb; color:#9ca3af; border-color:#e5e7eb; }
</style>

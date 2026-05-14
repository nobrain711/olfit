#!/usr/bin/env python3
"""브랜드 윤리 상태 조회 실행 파일.

이 파일은 인접한 브랜드 윤리 상태 산출물을 읽고, 브랜드별 비건 및
크루얼티 프리 상태를 단건 또는 전체 목록으로 출력합니다.
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path
from typing import Final, Literal, TypedDict, cast

EthicalStatusValue = Literal["Yes", "No", "uncertain"]

DATA_FILE_PATH: Final[Path] = Path(__file__).with_name("brand_ethical_status.json")


class BrandEthicalStatus(TypedDict):
    """단일 브랜드의 윤리 상태 데이터 구조입니다."""

    cruelty_free: EthicalStatusValue
    vegan: EthicalStatusValue


class BrandEthicalStatusRow(TypedDict):
    """표, JSON, CSV 출력에 공통으로 사용하는 직렬화 행입니다."""

    brand: str
    cruelty_free: EthicalStatusValue
    vegan: EthicalStatusValue


def normalize_brand_name(brand_name: str) -> str:
    """사용자 입력 브랜드명을 조회 가능한 형태로 정규화합니다."""
    return " ".join(brand_name.strip().upper().split())


def normalize_status_value(value: str) -> EthicalStatusValue:
    """산출물의 윤리 상태 값을 정규화하고 허용 값인지 검증합니다."""
    normalized_value = value.strip()
    if normalized_value not in {"Yes", "No", "uncertain"}:
        raise ValueError(f"지원하지 않는 윤리 상태 값입니다: {value}")
    return cast(EthicalStatusValue, normalized_value)


def load_brand_statuses(data_file_path: Path = DATA_FILE_PATH) -> dict[str, BrandEthicalStatus]:
    """JSON 산출물에서 브랜드별 윤리 상태를 읽고 정규화합니다."""
    with data_file_path.open(encoding="utf-8") as data_file:
        raw_data = json.load(data_file)

    statuses: dict[str, BrandEthicalStatus] = {}
    for brand_name, payload in raw_data.items():
        statuses[normalize_brand_name(brand_name)] = {
            "cruelty_free": normalize_status_value(payload["Cruelty-Free"]),
            "vegan": normalize_status_value(payload["Vegan"]),
        }
    return statuses


def find_brand_status(
    brand_name: str,
    statuses: dict[str, BrandEthicalStatus],
) -> tuple[str, BrandEthicalStatus] | None:
    """정확히 일치하거나 하나만 부분 일치하는 브랜드의 윤리 상태를 찾습니다."""
    normalized_brand_name = normalize_brand_name(brand_name)
    if not normalized_brand_name:
        return None
    if normalized_brand_name in statuses:
        return normalized_brand_name, statuses[normalized_brand_name]

    partial_matches = [
        (known_brand_name, status)
        for known_brand_name, status in statuses.items()
        if normalized_brand_name in known_brand_name
    ]
    if len(partial_matches) > 1:
        matched_names = ", ".join(brand_name for brand_name, _ in partial_matches)
        raise ValueError(f"브랜드명이 모호합니다: '{brand_name}'. 일치 후보: {matched_names}")
    if partial_matches:
        return partial_matches[0]
    return None


def iter_rows(statuses: dict[str, BrandEthicalStatus]) -> list[BrandEthicalStatusRow]:
    """전체 브랜드 윤리 상태를 출력 가능한 행 목록으로 변환합니다."""
    return [
        {
            "brand": brand_name,
            "cruelty_free": status["cruelty_free"],
            "vegan": status["vegan"],
        }
        for brand_name, status in sorted(statuses.items())
    ]


def print_table(rows: list[BrandEthicalStatusRow]) -> None:
    """브랜드 윤리 상태 행을 터미널 표 형태로 출력합니다."""
    headers = ("brand", "cruelty_free", "vegan")
    widths = {
        header: max(len(header), *(len(row[header]) for row in rows))
        for header in headers
    }
    print(" | ".join(header.ljust(widths[header]) for header in headers))
    print("-+-".join("-" * widths[header] for header in headers))
    for row in rows:
        print(" | ".join(row[header].ljust(widths[header]) for header in headers))


def print_csv(rows: list[BrandEthicalStatusRow]) -> None:
    """브랜드 윤리 상태 행을 표준 출력 CSV로 출력합니다."""
    writer = csv.DictWriter(sys.stdout, fieldnames=["brand", "cruelty_free", "vegan"])
    writer.writeheader()
    writer.writerows(rows)


def build_parser() -> argparse.ArgumentParser:
    """명령행 인자 파서를 생성합니다."""
    parser = argparse.ArgumentParser(
        description="브랜드별 비건 및 크루얼티 프리 상태를 조회합니다.",
    )
    parser.add_argument(
        "brand",
        nargs="?",
        help="조회할 브랜드명입니다. 생략하면 전체 브랜드를 출력합니다.",
    )
    parser.add_argument(
        "--format",
        choices=("table", "json", "csv"),
        default="table",
        help="출력 형식입니다. 기본값은 table입니다.",
    )
    return parser


def main() -> int:
    """브랜드 윤리 상태 조회 명령을 실행합니다."""
    args = build_parser().parse_args()
    statuses = load_brand_statuses()

    if args.brand:
        try:
            found = find_brand_status(args.brand, statuses)
        except ValueError as exc:
            print(str(exc), file=sys.stderr)
            return 1
        if not found:
            print(f"알 수 없는 브랜드입니다: {args.brand}", file=sys.stderr)
            return 1
        brand_name, status = found
        rows: list[BrandEthicalStatusRow] = [
            {
                "brand": brand_name,
                "cruelty_free": status["cruelty_free"],
                "vegan": status["vegan"],
            }
        ]
    else:
        rows = iter_rows(statuses)

    if args.format == "json":
        print(json.dumps(rows, ensure_ascii=False, indent=2))
    elif args.format == "csv":
        print_csv(rows)
    else:
        print_table(rows)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())


# File History
# 2026-05-14: 브랜드 윤리 상태 산출물 기반 조회 실행 파일을 생성했습니다.

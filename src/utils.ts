import { visit as unistVisit, Visitor, Test } from "unist-util-visit";
import {
  visitParents as unistVisitParents,
  Visitor as ParentVisitor,
  Test as ParentTest,
} from "unist-util-visit-parents";
import { LayoutNode } from "./types.js";

/**
 * Visit nodes in a Layout tree.
 */
export function visit(
  tree: LayoutNode,
  visitor: Visitor<LayoutNode>,
  reverse?: boolean,
): void;
export function visit(
  tree: LayoutNode,
  test: Test,
  visitor: Visitor<LayoutNode>,
  reverse?: boolean,
): void;
export function visit<T extends LayoutNode>(
  tree: LayoutNode,
  test: Test,
  visitor: Visitor<T>,
  reverse?: boolean,
): void;
export function visit(
  tree: LayoutNode,
  testOrVisitor: Test | Visitor<LayoutNode>,
  visitorOrReverse?: Visitor<LayoutNode> | boolean,
  reverse?: boolean,
): void {
  unistVisit(tree, testOrVisitor as any, visitorOrReverse as any, reverse);
}

/**
 * Visit nodes in a Layout tree with ancestry.
 */
export function visitParents(
  tree: LayoutNode,
  visitor: ParentVisitor<LayoutNode>,
  reverse?: boolean,
): void;
export function visitParents(
  tree: LayoutNode,
  test: ParentTest,
  visitor: ParentVisitor<LayoutNode>,
  reverse?: boolean,
): void;
export function visitParents<T extends LayoutNode>(
  tree: LayoutNode,
  test: ParentTest,
  visitor: ParentVisitor<T>,
  reverse?: boolean,
): void;
export function visitParents(
  tree: LayoutNode,
  testOrVisitor: ParentTest | ParentVisitor<LayoutNode>,
  visitorOrReverse?: ParentVisitor<LayoutNode> | boolean,
  reverse?: boolean,
): void {
  unistVisitParents(
    tree,
    testOrVisitor as any,
    visitorOrReverse as any,
    reverse,
  );
}
